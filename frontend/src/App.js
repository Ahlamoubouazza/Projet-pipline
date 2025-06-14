import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import backgroundImage from './assets/background-house.jpg';

function App() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    bedrooms: 3,
    bathrooms: 2,
    sqft_living: 1500,
    floors: 1,
    condition: 3,
    grade: 7
  });
  const [prediction, setPrediction] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [pipelineResults, setPipelineResults] = useState({});
  const [tableData, setTableData] = useState([]);
  const [plotUrl, setPlotUrl] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      alert("⚠️ Veuillez sélectionner un fichier.");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/upload", data);
      setUploadInfo(res.data);
      alert("✅ Fichier uploadé avec succès !");
    } catch (error) {
      alert("❌ Erreur lors de l'upload !");
    }
  };

  const runPipelineStep = async (step) => {
    try {
      let res;
      if (step === 'plot') {
        res = await axios.get(`http://localhost:8000/run_pipeline?step=${step}`, {
          responseType: 'blob'
        });
        const plotUrl = URL.createObjectURL(res.data);
        setPlotUrl(plotUrl);
      } else {
        res = await axios.get(`http://localhost:8000/run_pipeline?step=${step}`);
        setPipelineResults(prev => ({ ...prev, [step]: res.data }));
        if (res.data.rows) {
          setTableData(res.data.rows);
        } else if (Array.isArray(res.data)) {
          setTableData(res.data);
        }
      }
    } catch (error) {
      alert(`❌ Erreur lors de l'étape ${step} !`);
    }
  };

  const handlePredict = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/predict_house_price",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      setPrediction(res.data);
    } catch (error) {
      alert("❌ Erreur lors de la prédiction !");
    }
  };

  const renderTable = () => {
    if (!tableData || tableData.length === 0) return null;
    const headers = Object.keys(tableData[0]);
    return (
      <div className="table-container">
        <h3>📊 Résultats</h3>
        <table>
          <thead>
            <tr>
              {headers.map(header => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={`${index}-${header}`}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <header>
          <h1>🏡 Estimation Intelligente de Prix Immobilier</h1>
          <p className="subtitle">Analysez et prédisez les valeurs immobilières avec précision</p>
        </header>

        <div className="section">
          <h2>📤 Upload du fichier</h2>
          <div className="file-upload-container">
            <label className="file-upload-label">
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <span>{file ? file.name : "Choisir un fichier CSV..."}</span>
            </label>
            <button onClick={uploadFile}>Uploader</button>
          </div>
          {uploadInfo && (
            <p className="success-message">✔️ Fichier {uploadInfo.filename} uploadé avec succès</p>
          )}
        </div>

        <div className="section">
          <h2>🔧 Pipeline de traitement</h2>
          <div className="pipeline-buttons">
            <button onClick={() => runPipelineStep('ingest')}>Ingestion</button>
            <button onClick={() => runPipelineStep('clean')}>Nettoyage</button>
            <button onClick={() => runPipelineStep('aggregate')}>Agrégation</button>
            <button onClick={() => runPipelineStep('plot')}>Visualisation</button>
          </div>
          {renderTable()}
          {plotUrl && (
            <div className="plot-section">
              <h3>📈 Graphique des prix moyens</h3>
              <img src={plotUrl} alt="Graphique des prix moyens" />
            </div>
          )}
        </div>

        <div className="section">
          <h2>📝 Estimation de prix</h2>
          <div className="form-grid">
            {Object.entries(formData).map(([key, val]) => (
              <div key={key} className="form-row">
                <label>{key} :</label>
                <input
                  type="number"
                  value={val}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: Number(e.target.value) })
                  }
                />
              </div>
            ))}
          </div>
          <button className="predict-button" onClick={handlePredict}>
            Estimer le prix
          </button>
          {prediction && (
            <div className="prediction">
              <h3>💰 Prix estimé</h3>
              <p className="price">{prediction.predicted_price.toLocaleString()} $</p>
              <div className="features">
                <p>Caractéristiques :</p>
                <ul>
                  {Object.entries(prediction.input).map(([key, value]) => (
                    <li key={key}><strong>{key}</strong>: {value}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
