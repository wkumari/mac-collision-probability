import cgi
from google.appengine.api import users
import webapp2

MAIN_PAGE_HTML = """\
<html>
  <body>
  <h3>Random MAC Collision Probability Calculator</h3>    

   <p>In the <a href = "http://www.ieee802.org/PrivRecsg/">IEEE 802 EC Privacy Recommendation Study Group</a> there were 
       some <strike>disagreements</strike> discussions about how likely two stations choosing a MAC address at random would be
       to collide.<br>Because of the <a href="http://en.wikipedia.org/wiki/Birthday_problem">Birthday paradox</a> the
       probability is much higher than most people (including myself) would expect, even when the many bits are randomized.</p>

   <p>In order to allow participants to get a better feel for this (and quickly settle arguments!) I decided to make a toy
   app engine app to calculate the probabilities. This is based on some C code by Dan Harkins.<br><br></p>
   
    <form action="/calculate" method="post">
      <div><p>Number of bits: <input type="number" name="bits" min="1" max="48" value="%s"><br>
              Number of stations: <input type="number" name="stations" min="2" max="100000" value="%s"></div>
      <div><input type="submit" value="Calculate"></div>
    </form>
"""

MAIN_PAGE_FOOTER = """\
  <br>
  <hr>
  <small>Copyright &copy; 2015 - Warren Kumari (warren@kumari.net) v0.2</small>
  </body>
</html>
"""

class MainPage(webapp2.RequestHandler):
    def get(self):
        self.response.write(MAIN_PAGE_HTML % (32, 2000))
        self.response.write(MAIN_PAGE_FOOTER)
        

class Probability(webapp2.RequestHandler):
    def get(self):
      bits = self.request.get('bits') or 32
      stations = self.request.get('stations') or 1000
      self.response.write(MAIN_PAGE_HTML % (bits, stations))
      self.response.write(MAIN_PAGE_FOOTER)
      
    def post(self):
      try:
        bits = int(self.request.get('bits'))
        stations = int(self.request.get('stations'))
      except ValueError, e:
        self.response.write('<head><meta http-equiv="refresh" content="0;URL=\'/\'" /></head>')
        return        
      upper = (stations * (stations - 1))/2.0
      num = 2**bits
      res = (num-1.0)/num
      prob = 1.0 - res **upper
      tot = 1.0/prob 
        
                 
      self.response.write(MAIN_PAGE_HTML % (bits, stations))
      self.response.write('<p>The probability of a collision is : <tt>%1.8f</tt>' % prob)
      self.response.write("<br>That's 1 out of <tt>%10.2f</tt></p>" % tot)
      self.response.write(MAIN_PAGE_FOOTER)

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/calculate', Probability),
], debug=False)
