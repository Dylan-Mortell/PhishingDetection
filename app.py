from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
import joblib

app = Flask(__name__)

# Load pre-trained model and vectorizer
rf_Model = joblib.load("RandomForestAlgorithm.pkl")  
vectorizer = joblib.load("vectorizer.pkl")  

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    url = data['url']
    X = vectorizer.transform([url])
    prediction = rf_Model.predict(X)
    result = "phishing" if prediction[0] == 1 else "safe"
    return jsonify({'prediction': result})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)

# Save the trained model
joblib.dump(rf_Model, 'RandomForestAlgorithm.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')