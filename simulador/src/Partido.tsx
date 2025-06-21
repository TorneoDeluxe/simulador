// src/pages/Partido.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectorEquipos from "./components/SelectorEquipos/SelectorEquipos";
import "./components/Partido.css";

type Team = {
  name: string;
  logo: string;
  media: number;
};

const Partido: React.FC = () => {
  const navigate = useNavigate();
  const [equipoLocal, setEquipoLocal] = useState<Team | null>(null);
  const [equipoVisitante, setEquipoVisitante] = useState<Team | null>(null);

  const jugarPartido = () => {
    if (equipoLocal && equipoVisitante) {
      navigate("/partido/simulacion", {
        state: { local: equipoLocal, visitante: equipoVisitante },
      });
    } else {
      alert("Por favor selecciona ambos equipos.");
    }
  };

  return (
    <div>
      <h1>Elegir equipos</h1>

      <div className="partido-container">
        {/* Selector de equipo local */}
        <div className="selector-local">
          <h5>Equipo Local</h5>
          <SelectorEquipos onSelectedTeam={setEquipoLocal} />
        </div>

        {/* Resumen en el medio */}
        <div className="seleccion-resumen">
          <div className="equipo-resumen">
            {equipoLocal && (
              <div className="equipo-detalle">
                <img src={equipoLocal.logo} alt={equipoLocal.name} className="escudo-grande" />
                <div className="nombre">{equipoLocal.name}</div>
                <div className="media">{equipoLocal.media}</div>
              </div>
            )}
          </div>

          <div className="equipo-resumen">
            {equipoVisitante && (
              <div className="equipo-detalle">
                <img src={equipoVisitante.logo} alt={equipoVisitante.name} className="escudo-grande" />
                <div className="nombre">{equipoVisitante.name}</div>
                <div className="media">{equipoVisitante.media}</div>
              </div>
            )}
          </div>

          <button className="btn-jugar" onClick={jugarPartido} disabled={!equipoLocal || !equipoVisitante}>
            Jugar
          </button>
        </div>

        {/* Selector de equipo visitante */}
        <div className="selector-visitante">
          <h5>Equipo Visitante</h5>
          <SelectorEquipos onSelectedTeam={setEquipoVisitante} />
        </div>
      </div>
    </div>
  );
};

export default Partido;
