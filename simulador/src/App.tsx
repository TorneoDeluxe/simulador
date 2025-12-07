import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Inicio from './Inicio.tsx';
import Partido from './Partido.tsx';
import Score from './components/Score/Score.tsx';
import Penalties from './components/Penalties.tsx';
import Penales from './PenalesSelector.tsx';

const App: React.FC = () =>  {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/partido" element={<Partido />} />
      <Route path="/penales" element={<Penales />} />
      <Route path="/penales/simulacion" element={<Penalties />} />
      <Route path="/partido/simulacion" element={<Score />} />
    </Routes>
  ); 
}

export default App;
