import React, { useState } from "react";
import "./SelectorEquipos.css";

interface Team {
  name: string;
  logo: string;
  media: number;
}

interface League {
  name: string;
  teams: Team[];
}

interface Country {
  name: string;
  leagues: League[];
}

type Props = {
  ligas: League[];
  onSelectedTeam: (team: Team) => void;
};

const SelectorEquipos: React.FC<Props> = ({ ligas,  onSelectedTeam }) => {
  // tomar los países y pasarlos como props de la misma manera. O pasar solo los países como props y
  // dentro de ellos las ligas.
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);

  const selectedLeague = ligas[selectedLeagueIndex];

  const handleSeleccion = (equipo: Team) => {
    onSelectedTeam(equipo);
  };

  const siguienteLiga = () => {
    setSelectedLeagueIndex((prev) => (prev + 1) % ligas.length);
  };

  const anteriorLiga = () => {
    setSelectedLeagueIndex((prev) => (prev - 1 + ligas.length) % ligas.length);
  };

  return (
    <div className="selector-equipos">
      {/* Navegación de ligas */}
      <div className="ligas-navegacion">
        <button onClick={anteriorLiga}>{"<"}</button>
        <span>{selectedLeague.name}</span>
        <button onClick={siguienteLiga}>{">"}</button>
      </div>

      {/* Equipos */}
      <div className="equipos-grid">
        {selectedLeague.teams.map((equipo) => (
          <div
            key={equipo.name}
            className="equipo-card"
            onClick={() => handleSeleccion(equipo)}
          >
            <img src={equipo.logo} alt={equipo.name} className="escudos" />
            <span className="text name">{equipo.name}</span>
            <span className="text media">{equipo.media}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectorEquipos;
