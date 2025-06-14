import React, { useState } from "react";
import axios from "axios";
import TableComponent from "./components/TableComponent";
import "./App.css";

function App() {
  const [rows, setRows] = useState([]);

  const handleStep = async (step) => {
    const response = await axios.post(http://localhost:8000/pipeline?step=${step});
    if (response.data.rows) {
      setRows(response.data.rows);
    } else {
      alert("Erreur : " + response.data.error);
    }
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Pipeline de Traitement</h1>

      <div className="space-x-4 mb-6">
        <button className="btn-action" onClick={() => handleStep("ingest")}>Ingest Data</button>
        <button className="btn-action" onClick={() => handleStep("clean")}>Clean Data</button>
        <button className="btn-action" onClick={() => handleStep("aggregate")}>Aggregate</button>
      </div>

      <TableComponent rows={rows} />
    </div>
  );
}

export default App;