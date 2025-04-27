import React from 'react';
import { Link } from 'react-router-dom';

const Inicio: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Simulador de Partidos</h1>
      <p>Seleccioná una opción para comenzar:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <Link to="/partido" style={{ textDecoration: 'none', fontSize: '18px' }}>
            Partido
          </Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/penales" style={{ textDecoration: 'none', fontSize: '18px' }}>
            Penales (en construcción)
          </Link>
        </li>
        <li style={{ margin: '10px 0' }}>
          <Link to="/editar" style={{ textDecoration: 'none', fontSize: '18px' }}>
            Editar (en construcción)
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Inicio;
