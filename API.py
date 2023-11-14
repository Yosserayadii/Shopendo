import numpy as np
import pandas as pd
from io import BytesIO
import os
from flask import Flask, jsonify, request
import re
import tensorflow as tf
from tqdm import tqdm
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
import pickle as pk
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from pymongo import MongoClient
from bson import ObjectId
from flask_cors import CORS, cross_origin


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# database settings 
client = MongoClient('127.0.0.1', 27017)
db = client.shopit
products = db.products
# load the saved models
pca = pk.load(open("./result/pca.pkl", "rb"))
knn = pk.load(open("./result/knn_model.pkl", "rb"))
model = tf.keras.models.load_model("./result/model.h5")

# load data
styles_df = pd.read_csv("styles.csv", on_bad_lines='skip')
styles_df['id'] = styles_df['id'].astype(int)
image_folder = "./images"
image_files = os.listdir(image_folder)
image_files = [f for f in image_files if f.endswith('.jpg')]
data = styles_df.loc[styles_df['id'].isin([int(f.replace(".jpg","")) for f in image_files])].reset_index(drop=True)
data['filename'] = data['id'].apply(lambda x: os.path.join(image_folder, f"{x}.jpg"))

train = data.iloc[       :int(len(data)*0.8)       ,       :        ]
val = data.iloc[int(len(data)*0.8):,:].reset_index(drop=True)

@app.route('/recommend', methods=['POST'])
@cross_origin()
def recommend():
    
    # Get the product ID from the request
    product_id = request.form.get('_id')
    print('Received product ID:', product_id)

    # Find the product with the given ID in the database
    produit = products.find_one({'_id': ObjectId(product_id)})
    print('Retrieved product:', produit)

    # Check if the product exists
    if not produit:
        return jsonify({'error': 'Product not found'})
    # # Get the product image filename
    image_dict = produit['images'][0]
    print('Image dictionary:', image_dict)

# Get the product image filename from the dataset
    image_filename = data.loc[data['id'] == produit['id'], 'filename'].values[0]

# Construct the correct image path
    image_path = os.path.join(image_folder, os.path.basename(image_filename))
    img = img_to_array(load_img(image_path, target_size=(256, 256, 3)))
    img = img / 255.
    img_batch = img[np.newaxis,:]

    # Extract features from the image
    img_features = model.predict(img_batch)

    # Reduce dimensionality using PCA
    img_pca = pca.transform(img_features)
    img_pc_pd = pd.DataFrame(img_pca)

    # Get k nearest neighbors
    dist, index = knn.kneighbors(X=img_pc_pd, n_neighbors=6)

    # Get similar products
    result = []

    for i in range(len(index[0])):
        img_idx = index[0][i]
        img_path = data.iloc[img_idx]['filename']

        # Find the similar product in the database
        similar_product = products.find_one({"id": int(train.iloc[img_idx]['id'])})

        if similar_product:
            similar_product["_id"] = str(similar_product["_id"])
            result.append(similar_product)

    return jsonify({'products': result})

if __name__ == '_main_':
    app.run(debug=True)