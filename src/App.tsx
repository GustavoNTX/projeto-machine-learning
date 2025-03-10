import { useState } from "react";
import { trainModel, predictCategory } from "./ml/classification";
import ClusterGraph from "./components/ClusterGraph";

function App() {
  const [speed, setSpeed] = useState(5);
  const [strength, setStrength] = useState(5);
  const [endurance, setEndurance] = useState(5);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState<string | null>(null);

  const handleTrain = async () => {
    const result = await trainModel();
    setAccuracy(result);
  };

  const handlePredict = async () => {
    const result = await predictCategory(speed, strength, endurance);
    setPrediction(result);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Classificação de Atletas (ML)</h1>
      <button onClick={handleTrain}>Treinar Modelo e Avaliar Precisão</button>
      {accuracy && <h3>Precisão do Modelo: {accuracy}</h3>}

      <h2>Testar Novo Atleta</h2>
      <label>Velocidade: <input type="number" value={speed} onChange={e => setSpeed(Number(e.target.value))} /></label>
      <br />
      <label>Força: <input type="number" value={strength} onChange={e => setStrength(Number(e.target.value))} /></label>
      <br />
      <label>Resistência: <input type="number" value={endurance} onChange={e => setEndurance(Number(e.target.value))} /></label>
      <br />
      <button onClick={handlePredict}>Classificar</button>
      {prediction && <h3>Categoria Prevista: {prediction}</h3>}

      <ClusterGraph />
    </div>
  );
}

export default App;
