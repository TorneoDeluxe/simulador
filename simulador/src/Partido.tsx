// src/pages/Partido.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SelectorEquipos from "./components/SelectorEquipos/SelectorEquipos";
import "./components/Partido.css";
import { FaArrowLeft } from "react-icons/fa";

type Team = {
  name: string;
  logo: string;
  media: number;
};

const Partido: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { local?: Team; visitante?: Team };
  const [equipoLocal, setEquipoLocal] = useState<Team | null>(state?.local ?? null);
  const [equipoVisitante, setEquipoVisitante] = useState<Team | null>(state?.visitante ?? null);  

  const jugarPartido = () => {
    if (equipoLocal && equipoVisitante) {
      navigate("/partido/simulacion", {
        state: { local: equipoLocal, visitante: equipoVisitante },
      });
    } else {
      alert("Por favor selecciona ambos equipos.");
    }
  };

  const volverAInicio = () => {
      navigate("/");
  }

  return (
    <div>
      <button className="backbutton" onClick={volverAInicio}>
        <FaArrowLeft aria-hidden />
        Volver a Inicio</button>
      <div className="titulo">
        <span>Elegir equipos</span>
      </div>
      
      <div className="partido-container">
        {/* Selector de equipo local */}
        <div className="selector-local">
          <h5 className="elegir-equipo">Local</h5>
          <SelectorEquipos onSelectedTeam={setEquipoLocal} selectedTeam={equipoLocal}/>
        </div>

        {/* Resumen en el medio */}
        <div className="seleccion-resumen">
          <div className="equipo-resumen">
            {equipoLocal && (
              <div className="equipo-detalle detalle-local">
                <img src={equipoLocal.logo} alt={equipoLocal.name} className="escudo-grande" />
                <div className="nombre">{equipoLocal.name}</div>
                <div className="media">{equipoLocal.media}</div>
              </div>
            )}
          </div>
          
          <button className="btn-jugar" onClick={jugarPartido} disabled={!equipoLocal || !equipoVisitante}>
            Jugar
          </button>

          <div className="equipo-resumen">
            {equipoVisitante && (
              <div className="equipo-detalle detalle-visitante">
                <img src={equipoVisitante.logo} alt={equipoVisitante.name} className="escudo-grande" />
                <div className="nombre">{equipoVisitante.name}</div>
                <div className="media">{equipoVisitante.media}</div>
              </div>
            )}
          </div>
        </div>

        {/* Selector de equipo visitante */}
        <div className="selector-visitante">
          <h5 className="elegir-equipo">Visitante</h5>
          <SelectorEquipos onSelectedTeam={setEquipoVisitante} selectedTeam={equipoVisitante}/>
        </div>
      </div>
    </div>
  );
};

export default Partido;
