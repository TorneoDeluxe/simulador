import React, { useState, useEffect } from "react";
import "./SelectorEquipos.css"; // Estilos para el diseño inspirado en PES 6

interface Team {
  name: string;
  logo: string;
  media: number;
}

interface League {
  name: string;
  teams: Team[];
}

const SelectorEquipos: React.FC<{ ligas: League[]; onSelectedTeams: (local: Team, visitante: Team) => void }> = ({ ligas, onSelectedTeams: onEquiposSeleccionados }) => {
  const [selectedLeague, setSelectedLeague] = useState<League>(ligas[0]);
  const [local, setLocal] = useState<Team | null>(null);
  const [visitante, setVisitante] = useState<Team | null>(null);

  const handleEquipoSeleccionado = (equipo: Team, tipo: "local" | "visitante") => {
    if (tipo === "local") {
      setLocal(equipo);
    } else {
      setVisitante(equipo);
    } 
    if (local && visitante) {
      onEquiposSeleccionados(local, visitante);
    }
  };

  useEffect(() => {
    if (local && visitante) {
      onEquiposSeleccionados(local, visitante);
    }
    const fetchData = async () => {
      try {
        const response = await fetch("https://localhost:7225/api/ligas");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    fetchData();
  }, [local, visitante]);
  
  return (
    <div className="selector-equipos">
      {/* Navegación de ligas */}
      <div className="ligas-navegacion">
        <button onClick={() => setSelectedLeague(ligas[Math.max(0, ligas.indexOf(selectedLeague) - 1)])}>{"<"}</button>
        <span>{selectedLeague.name}</span>
        <button onClick={() => setSelectedLeague(ligas[Math.min(ligas.length - 1, ligas.indexOf(selectedLeague) + 1)])}>{">"}</button>
      </div>

      <div className="equipos-grid">
        {selectedLeague.teams.map((equipo) => (
          <div
            key={equipo.name}
            className="equipo-card"
            onClick={() => handleEquipoSeleccionado(equipo, local ? "visitante" : "local")}
          >
            <img src={equipo.logo} alt={equipo.name} className="escudos"/>
            <span className="text name">{equipo.name}</span>
            <span className="text media">{equipo.media}</span>
          </div>
        ))}
      </div>

      {/* Equipos seleccionados */}
      <div className="equipos-seleccionados">
        <div className="equipo-seleccionado">
          {local ? (
            <>
              <img src={local.logo} alt={local.name} />
              <h3>{local.name}</h3>
              <p>Media: {local.media}</p>
            </>
          ) : (
            <p>Local</p>
          )}
        </div>
        <div className="equipo-seleccionado">
          {visitante ? (
            <>
              <img src={visitante.logo} alt={visitante.name} />
              <h3>{visitante.name}</h3>
              <p>Media: {visitante.media}</p>
            </>
          ) : (
            <p>Visitante</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectorEquipos;
