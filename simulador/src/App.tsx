import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

import Inicio from './Inicio.tsx';
import Partido from './Partido.tsx';
import Score from './components/Score/Score.tsx';

const App: React.FC = () =>  {

  useEffect(() => {
    const fetchLigas = async () => {
      try {
        const response = await fetch("https://localhost:7225/api/equipos");
        const data = await response.json();
        console.log("Datos recibidos:", data);
      } catch (error) {
        console.error("Error al cargar ligas:", error);
      }
    };

    fetchLigas();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/partido" element={<Partido />} />
        <Route path="/partido/simulacion" element={<Score />} />
      </Routes>
    </Router>
  ) 
}

export default App;