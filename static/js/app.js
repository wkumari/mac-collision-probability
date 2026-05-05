document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bitsRange = document.getElementById('bits');
    const bitsNum = document.getElementById('bits-num');
    const bitsVal = document.getElementById('bits-val');

    const stationsRange = document.getElementById('stations');
    const stationsNum = document.getElementById('stations-num');
    const stationsVal = document.getElementById('stations-val');

    const probOutput = document.getElementById('prob-output');
    const totOutput = document.getElementById('tot-output');

    // Initialize Chart
    const ctx = document.getElementById('probChart').getContext('2d');
    let probChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Collision Probability',
                data: [],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Stations',
                        color: '#94a3b8'
                    },
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability',
                        color: '#94a3b8'
                    },
                    min: 0,
                    max: 1,
                    ticks: { color: '#94a3b8' },
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });

    // Synchronize input pairs (Range & Number)
    function setupSync(rangeInput, numInput, valDisplay, callback) {
        rangeInput.addEventListener('input', (e) => {
            numInput.value = e.target.value;
            valDisplay.textContent = e.target.value;
            callback();
        });

        numInput.addEventListener('input', (e) => {
            rangeInput.value = e.target.value;
            valDisplay.textContent = e.target.value;
            callback();
        });
    }

    setupSync(bitsRange, bitsNum, bitsVal, updateResults);
    setupSync(stationsRange, stationsNum, stationsVal, updateResults);

    function calculateProbability(bits, stations) {
        const n = Math.pow(2, bits);
        // Birthday paradox approximation: p ≈ 1 - e^(-k(k-1)/(2N))
        const exponent = -(stations * (stations - 1)) / (2 * n);
        return 1 - Math.exp(exponent);
    }

    function updateResults() {
        const bits = parseInt(bitsNum.value);
        const stations = parseInt(stationsNum.value);

        if (isNaN(bits) || isNaN(stations)) return;

        const prob = calculateProbability(bits, stations);
        const tot = prob > 0 ? 1 / prob : Infinity;

        // Update results text
        if (prob < 0.00000001 && prob > 0) {
            probOutput.textContent = prob.toExponential(4);
        } else {
            probOutput.textContent = prob.toFixed(8);
        }

        if (tot === Infinity) {
            totOutput.textContent = '∞';
        } else if (tot > 1000000) {
            totOutput.textContent = tot.toExponential(2);
        } else {
            totOutput.textContent = tot.toFixed(2);
        }

        // Update Chart
        updateChart(bits, stations);
    }

    function updateChart(currentBits, currentStations) {
        const dataPoints = 20;
        const labels = [];
        const data = [];
        
        // We'll draw the curve up to 2x the current stations or at least 100 to make the curve nice
        const maxPlot = Math.max(currentStations * 1.5, 100);
        const step = Math.ceil(maxPlot / dataPoints);

        for (let i = 1; i <= dataPoints; i++) {
            const s = i * step;
            labels.push(s);
            data.push(calculateProbability(currentBits, s));
        }

        probChart.data.labels = labels;
        probChart.data.datasets[0].data = data;
        probChart.update();
    }

    // Initial run
    updateResults();
});
