import pandas as pd
import pymongo
import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# Configure cloudinary
cloudinary.config(
 cloud_name="dzwiwxbis",
 api_key="879647857365887",
 api_secret="b1HFWEoGpRXA8iARx3LpOk98H14",
  secure = True
)

# Connexion à la base de données MongoDB
client = pymongo.MongoClient("mongodb://127.0.0.1:27017/shopit")
db = client["shopit"]
collection = db["products"]

# Preprocessing step
images_folder = "images"
styles_df = pd.read_csv("styles.csv", on_bad_lines='skip')
images_df = pd.DataFrame(os.listdir(images_folder), columns=['filename'])
images_df['id'] = images_df['filename'].apply(lambda x: int(x.replace(".jpg", "")))
data = styles_df.merge(images_df,on='id',how='left').reset_index(drop=True)
data['filename'] = data['filename'].fillna('').apply(lambda x: os.path.join(images_folder, str(x)))
data = data[data['filename'].apply(lambda x: os.path.isfile(x))].reset_index(drop=True)

data = data.reset_index(drop=True)

# Parcourir chaque ligne et insérer les données dans la collection
for index, row in data.iterrows():
    # Chemin d'accès à l'image
    image_path = "./images/" + str(row["id"]) + ".jpg"
    
    # Upload image to cloudinary
    result = cloudinary.uploader.upload(image_path)
    image_url, options = cloudinary_url(result['public_id'], format=result['format'], crop='fill')

    # Insérer les données dans la collection MongoDB
    document = {
       "id": row["id"],
       "seller": row["gender"],
       "Category": row["masterCategory"],
       "description": row["subCategory"],
       "description": row["articleType"],
       "description": row["baseColour"],
       "description": row["season"],
       "description": row["year"],
       "description": row["usage"],
       "price": 12,
       "ratings": 2,
        "name": row["productDisplayName"],
       "images": [{
           "public_id": result['public_id'],
           "url": image_url,
           "_id": str(collection.insert_one({"path": image_url}).inserted_id)
       }],
       "stock": 20,
       "numOfReviews": 0
   }
    
    collection.insert_one(document)

# Fermer la connexion à la base de données MongoDB
client.close()
