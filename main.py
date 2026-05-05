from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def main_page():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():
    """
    Optional API endpoint in case someone wants to query the probability via API.
    Primarily, the calculations are done client-side.
    """
    try:
        data = request.get_json()
        bits = int(data.get("bits", 32))
        stations = int(data.get("stations", 2000))
    except (ValueError, TypeError, AttributeError):
        return jsonify({"error": "Invalid input"}), 400

    upper = (stations * (stations - 1)) / 2.0
    num = 2**bits
    res = (num - 1.0) / num
    prob = 1.0 - res**upper
    tot = 1.0 / prob if prob > 0 else float('inf')

    return jsonify({
        "bits": bits,
        "stations": stations,
        "probability": prob,
        "one_in": tot
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8082)
