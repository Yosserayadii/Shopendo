import pymongo

#Connect to the MongoDB database
client = pymongo.MongoClient("mongodb://127.0.0.1:27017/shopit")
db = client["shopit"]
collection = db["products"]

#Delete all products from the collection
collection.delete_many({})

#Close the MongoDB connection
client.close()


