# 🏡 Projet Pipeline de Données Immobilier avec FastAPI & Dask

Ce projet est une API de traitement et d’analyse de données immobilières, permettant de :
- Uploader un fichier CSV
- Lancer un pipeline d'analyse (ingestion, nettoyage, agrégation, visualisation)
- Prédire le prix d’un bien immobilier à partir de ses caractéristiques

---

## 🚀 Fonctionnalités

- 📁 Upload de fichiers `.csv`
- 🧹 Nettoyage automatique (suppression des lignes invalides)
- 📊 Moyenne des prix par nombre de chambres
- 📈 Graphique généré automatiquement (bar chart)
- 💡 Prédiction du prix avec un modèle de régression linéaire

---

## 🛠️ Technologies utilisées

- **Backend** : FastAPI, Dask, Scikit-learn, Matplotlib
- **Frontend** : à intégrer séparément (par ex. avec React ou Swagger)
- **Langage** : Python 3

---

## 📂 Structure des fichiers
Projet-pipline/
├── main.py # API FastAPI
├── pipeline.py # Logique du pipeline
├── uploads/ # Dossier pour les fichiers CSV uploadés
├── outputs/ # Dossier pour les résultats (graphiques)
├── requirements.txt # Dépendances Python
└── README.md # Documentation du projet
Utilisation de l’API
POST /upload
Uploade un fichier CSV

Paramètre : file (multipart/form-data)

GET /run_pipeline?step=ingest|clean|aggregate|plot
Lance une étape du pipeline :

ingest : lit les données

clean : supprime les lignes incomplètes/invalides

aggregate : moyenne des prix par chambres

plot : génère un graphique

POST /predict_house_price
Prédit un prix à partir des caractéristiques fournies

Exemples de champs :

json
Copy
Edit
{
  "bedrooms": 3,
  "bathrooms": 2,
  "sqft_living": 1400,
  "floors": 1,
  "condition": 3,
  "grade": 7
}
📈 Exemple de graphique
Le graphe généré par /run_pipeline?step=plot affiche :

Prix moyen par nombre de chambres (outputs/plot.png)

📌 Auteur
Projet réalisé par Ahlam Oubouazza et nada ezouhoure l3chabi, étudiante en Big Data Analytics.

📄 Licence
Ce projet est libre pour usage personnel ou académique. Pour toute autre utilisation, merci de contacter l’auteure.

yaml
Copy
Edit

---

### 🛠 Étapes :

1. Ouvre ton éditeur de code (ex: VS Code)
2. Crée un fichier `README.md` dans le dossier du projet
3. Colle le contenu ci-dessus
4. Sauvegarde
