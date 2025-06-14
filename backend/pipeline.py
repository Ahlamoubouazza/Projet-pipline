import dask.dataframe as dd
import pandas as pd
import os
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

FEATURE_COLS = ["bedrooms", "bathrooms", "sqft_living", "floors", "condition", "grade"]

def run_pipeline_step(step, filepath, cache):
    if step == "ingest":
        if filepath.endswith(".csv"):
            ddf = dd.read_csv(filepath)
        else:
            return {"error": "Format non supporté. Utilisez un fichier CSV."}

        cache["df"] = ddf
        # on récupère les 5 premières lignes en dict (convertir en pandas pour head())
        head_pd = ddf.head(5)
        return {"columns": list(head_pd.columns), "rows": head_pd.to_dict(orient="records")}

    elif step == "clean":
        ddf = cache.get("df")
        if ddf is None:
            return {"error": "Aucune donnée ingérée"}
        
        ddf = ddf.dropna(subset=["price"] + FEATURE_COLS)
        ddf = ddf[ddf["price"] > 0]
        for col in FEATURE_COLS:
            ddf = ddf[ddf[col] > 0]

        cache["df"] = ddf
        head_pd = ddf.head(5)
        return {"message": "Nettoyage effectué.", "rows": head_pd.to_dict(orient="records")}

    elif step == "aggregate":
        ddf = cache.get("df")
        if ddf is None:
            return {"error": "Aucune donnée ingérée"}
        result = ddf.groupby("bedrooms")["price"].mean().compute().reset_index()
        cache["agg"] = result
        return result.to_dict(orient="records")

    elif step == "plot":
        df = cache.get("agg")
        if df is None:
            return {"error": "Aucune donnée agrégée"}
        if not isinstance(df, pd.DataFrame):
            df = pd.DataFrame(df)
        plt.figure(figsize=(8, 5))
        df.plot(x="bedrooms", y="price", kind="bar")
        plt.title("Prix moyen par nombre de chambres")
        plt.xlabel("Chambres")
        plt.ylabel("Prix moyen ($)")
        plt.grid(True)
        plt.tight_layout()
        plot_path = os.path.join(OUTPUT_DIR, "plot.png")
        plt.savefig(plot_path)
        plt.close()
        return {"plot_url": "/static/plot.png"}

    else:
        return {"error": f"Étape inconnue : {step}"}

def predict_from_value(value_type, value, cache):
    if "df" not in cache:
        return {"error": "Données non chargées. Lance l'ingestion/nettoyage d'abord."}

    try:
        df = cache["df"].compute()
        df = df.dropna(subset=["price"] + FEATURE_COLS)
        df = df[df["price"] > 0]
        for col in FEATURE_COLS:
            df = df[df[col] > 0]

        model = LinearRegression()
        X = df[FEATURE_COLS]
        y = df["price"]
        model.fit(X, y)

        if value_type == "house_features":
            input_df = pd.DataFrame([value])
            prediction = model.predict(input_df)[0]
            return {
                "input": value,
                "predicted_price": round(prediction, 2)
            }
        else:
            return {"error": "Type de prédiction non reconnu : utilisez 'house_features'."}

    except Exception as e:
        return {"error": f"Erreur dans la prédiction : {str(e)}"}
