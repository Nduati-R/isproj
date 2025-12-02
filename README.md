# Intelligent Crop Advisory System (ICAS)

### AI-Powered Crop Recommendation Web Application for Kenyan Smallholder Farmers

## Overview

The Intelligent Crop Advisory System (ICAS) is a **web-based expert system** that uses machine learning, soil analytics, and climate data to recommend the most suitable crops for Kenyan farmers. The system analyzes soil characteristics, GPS-based location data, and weather conditions to produce personalized, data-driven crop suggestions.

It leverages:

* Trained **Random Forest and XGBoost models**
* **Supabase** for cloud database management
* **Lovable** for backend deployment
* **Python (Pandas, NumPy, Scikit-Learn)** for model development
* A responsive **web interface** for farmer interaction

The goal is to enhance agricultural decision-making and boost farmer productivity through AI-powered insights.

---

## Problem Statement

Kenyan smallholder farmers often struggle with unpredictable weather, limited agronomic knowledge, and inaccurate soil assessments. Many existing agricultural apps, such as PlantNuri, offer general advice but lack:

* Soil-specific recommendations
* Location-aware predictions
* Machine-learning-driven personalization

ICAS addresses these gaps by delivering **precise, data-backed crop recommendations** based on environmental and agronomic factors unique to each farmer.

---

## Project Objectives

* Build an AI-driven crop recommendation system.
* Utilize soil, climate, and geospatial data for intelligent decision support.
* Provide a simple, accessible web interface for farmers.
* Integrate a feedback loop to enhance future model accuracy.
* Support both English and Swahili for broader accessibility.

---

## Tech Stack

### Backend & API

* Python 3.10
* Flask or Django REST Framework
* Scikit-Learn, XGBoost
* Lovable (backend orchestration)

### Frontend

* HTML, CSS, JavaScript
* Responsive design

### Database

* Supabase (PostgreSQL)
* GIS-ready storage for location-based queries

### ML & Data Tools

* Pandas
* NumPy
* Scikit-Learn
* Jupyter / Google Colab

---

## Project Structure

```
├── backend/
│   ├── app.py                 
│   ├── model/
│   │   ├── random_forest.pkl
│   │   └── xgboost.pkl
│   ├── utils/
│   │   └── preprocessing.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── main.js
│
├── database/
│   ├── schema.sql
│   └── supabase-config.json
│
├── notebooks/
│   └── model_training.ipynb
│
└── README.md
```

---

## System Features

### 1. User Input

Farmers provide:

* GPS location
* Soil pH & texture (optional)
* Farm size

### 2. Automated Data Retrieval

The system pulls:

* Weather forecast
* Temperature
* Rainfall
* Soil information

### 3. Crop Recommendation Engine

Using Random Forest & XGBoost, the system analyzes:

* Soil chemistry
* Weather conditions
* Geospatial attributes

Outputs include:

* Recommended crops
* Confidence score
* Suitability explanation

### 4. Feedback Module

Farmers rate recommendations.
The data supports future model retraining.

---

## Installation & Setup

### 1. Clone the Repository

```
git clone https://github.com/Nduati-R/isproj
cd ICAS
```

### 2. Backend Setup

```
cd backend
pip install -r requirements.txt
python app.py
```

### 3. Frontend Setup

Open:

```
frontend/index.html
```

### 4. Environment Variables

Create a `.env` file:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
MODEL_PATH=model/
```

---

## Model Training

Models were trained in Google Colab using soil and climate datasets.
Algorithms used:

* Random Forest
* XGBoost

Performance evaluated using:

* Accuracy
* F1-score
* Cross-validation

Final models stored in `/backend/model/`.

---

## Deployment

The system is deployed using:

* Lovable for backend hosting
* Supabase for database storage
* Static hosting for the web interface

---

## Results

ICAS achieved:

* Accurate crop predictions
* Easy-to-use interface for farmers
* Efficient response time
* High scalability through Supabase + Lovable architecture

---

## Future Enhancements

* Integrate handheld soil sensor devices
* Add NDVI/satellite vegetation interpretation
* Expand crop variety coverage
* Add mobile app support
* Implement deep-learning models (TabNet, CatBoost)

---

##  Author

**Ryan Nduati**
Strathmore University – Faculty of Computing

---

If you'd like, I can also generate:
✔ A **LICENSE file**
✔ A **CONTRIBUTING.md**
✔ A **project logo**
✔ GitHub **badges** for your README
