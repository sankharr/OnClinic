# -*- coding: utf-8 -*-
"""
Created on Tue May  5 20:24:21 2020

@author: 94712
"""


import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, render_template
import pickle
import csv

with open('api.csv', newline='') as f:
    reader = csv.reader(f)
    fresh_data = dict(reader) 
    data = fresh_data.copy()

print(data.values())
app = Flask(__name__)
model = pickle.load(open('../Models/model_decisiontree.pkl','rb'))


@app.route('/api/predict',methods=["POST"])
def predict():
    symptom = request.get_json()["symptoms"]
    data = fresh_data.copy()
    print(symptom)
    for i in range(len(symptom)):
        data[symptom[i]] = 1
    #features = data.values()
    #print(features)
    vals = np.fromiter(data.values(), dtype=float)
    disease = model.predict([vals])
    print(disease)
    return str(disease)


if __name__ == "__main__":
    app.run(debug=True)