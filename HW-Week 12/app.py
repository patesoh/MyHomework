from flask import Flask, render_template, redirect
import pymongo
from pymongo import MongoClient
import mars_scrape 


# Create an instance of our Flask app, initiate connection to MongoDB.
app = Flask(__name__)

client = MongoClient()

client = pymongo.MongoClient('localhost',27017)

#create a new database if it doesnt exist
db = client['mars_db']
collection = db['data']
  
# # Route to render the html
@app.route("/")
def home():

   # Render the html
   mars_info = db.mars.data.find_one()
   return render_template("index.html", mars_info = mars_info)


# Route to trigger scrape
@app.route("/scrape")
def scrape():
    # Run the scrape function
    mars_info = mars_scrape.scrape_info()
    db.collection.delete_many({})
    # Find one record of data from the mongo database
    db.mars.data.update({}, mars_info, upsert=True)
    #Return template and data
    return redirect("localhost:5000/")




    
if __name__ == "__main__":
    app.run(debug=True)
