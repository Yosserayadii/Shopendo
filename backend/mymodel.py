import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.model_selection import train_test_split
from sklearn.metrics import average_precision_score
import pickle

# Load the Amazon ratings dataset
amazon_ratings = pd.read_csv('ratings_Beauty.csv')
amazon_ratings = amazon_ratings.dropna()

# Group the ratings by product ID and calculate the mean rating
product_ratings = amazon_ratings.groupby('ProductId')['Rating'].agg(['mean', 'count']).reset_index().rename(columns={'ProductId':'ProductID'})

# Keep only products with at least 20 ratings
product_ratings = product_ratings[product_ratings['count'] >= 20]
# Preprocess the data
product_ratings['ProductId'] = product_ratings['ProductID'].astype(str)

# Split the dataset into train and test sets
train, test = train_test_split(product_ratings, test_size=0.2, random_state=42)

# Create a TF-IDF matrix for train and test sets
tfidf = TfidfVectorizer(stop_words='english')
tfidf_train = tfidf.fit_transform(train['ProductID'])
tfidf_test = tfidf.transform(test['ProductID'])

# Find the nearest neighbors for the product ID
nbrs = NearestNeighbors(n_neighbors=20, algorithm='brute').fit(tfidf_train)
print(test)
product_id = 'B0000Y3C3I'  # replace with a valid product ID from the test set
product_index = test[test['ProductID'] == product_id].index.values[0]
distances, indices = nbrs.kneighbors(tfidf_test[product_index])

# Get the indices of the recommended products
product_indices = indices.flatten()[1:]

# Get the names of the recommended products
recommend_ids = train['ProductID'].iloc[product_indices].tolist()

# Calculate evaluation metrics
true_positive = len(set(recommend_ids).intersection(set(test[test['ProductID'].isin(recommend_ids)]['ProductID'])))
false_positive = len(recommend_ids) - true_positive
false_negative = len(test[test['ProductID'].isin(recommend_ids)]) - true_positive
true_negative = len(test) - (true_positive + false_positive + false_negative)

# Calculate accuracy
accuracy = (true_positive + true_negative) / len(test)

# Calculate MAP
y_true = np.zeros(len(test))
y_pred = np.zeros(len(test))
for i, product_id in enumerate(test['ProductID']):
    if product_id in recommend_ids:
        y_pred[i] = 1
    if product_id == product_id:
        y_true[i] = 1
map_score = average_precision_score(y_true, y_pred)

print("Accuracy: {:.4f}".format(accuracy))
print("MAP Score: {:.4f}".format(map_score))

# Create dictionary to store variables
data = {
    'amazon_ratings': amazon_ratings,
    'product_ratings': product_ratings,
    'train': train,
    'test': test,
    'tfidf': tfidf,
    'tfidf_train': tfidf_train,
    'tfidf_test': tfidf_test,
    'nbrs': nbrs,
    'product_indices': product_indices,
    'recommend_ids': recommend_ids,
    'true_positive': true_positive,
    'false_positive': false_positive,
    'false_negative': false_negative,
    'true_negative': true_negative,
    'accuracy': accuracy,
    'map_score': map_score
}
# Open file and write data using pickle
with open('data.pkl', 'wb') as f:
    pickle.dump(data, f)

# Close the file
f.close()

