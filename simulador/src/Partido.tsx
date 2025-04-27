// src/pages/Partido.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectorEquipos from "./components/SelectorEquipos/SelectorEquipos";

const Partido: React.FC = () => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState<{ local: any; visitante: any } | null>(null);

  const handleEquiposSeleccionados = (local: any, visitante: any) => {
    setEquipos({ local, visitante });
  };

  const jugarPartido = () => {
    if (equipos) {
      navigate("/partido/simulacion", { state: { local: equipos.local, visitante: equipos.visitante } });
    } else {
      alert("Por favor selecciona ambos equipos.");
    }
  };
  const generateLogoPath = (name: string) => {
    const basePath = "src/assets/Escudos";
    return `${basePath}/${name.replace(/\s+/g, "_").replace(/[()]/g, "")}.png`;
  };

  return (
    <div>
      <h1>Elegir equipos</h1>
      <SelectorEquipos
        ligas={[
          {
            name: "Primera División Argentina",
            teams: [
                { name: "Argentinos Juniors", media: 71 },
                { name: "Banfield", media: 70 },
                { name: "Belgrano", media: 69 },
                { name: "Boca Juniors", media: 79 },
                { name: "Colón", media: 68 },     
                { name: "Estudiantes LP", media: 75 },
                { name: "Gimnasia LP", media: 70 },
                { name: "Huracán", media: 69 },
                { name: "Independiente", media: 76 },
                { name: "Lanús", media: 72 },
                { name: "Newell's", media: 73 },
                { name: "Rosario Central", media: 73 },
                { name: "River Plate", media: 81 },
                { name: "San Lorenzo", media: 70 },
                { name: "Racing", media: 77 },
                { name: "Talleres", media: 71 },
                { name: "Unión", media: 68 },
                { name: "Vélez Sarsfield", media: 74 },
                //Este array se va a reemplazar por la response de la llamada al endpoint de Primera, y así con cada liga.
            ].map((team) => ({
              ...team,
              logo: generateLogoPath(team.name),
            })),
          },
          {
            name: "Primera B Nacional",
            teams: [
              { name: "Aldosivi", media: 66 },
              { name: "Almagro", media: 64 },
              { name: "Arsenal de Sarandí", media: 67 },
              { name: "Atlanta", media: 63 },
              { name: "Atlético Tucumán", media: 68 },
              { name: "Chacarita", media: 67 },
              { name: "Defensa y Justicia", media: 72 },
              { name: "Ferro", media: 66 },
              { name: "Gimnasia de Jujuy", media: 63 },
              { name: "Godoy Cruz", media: 70 },
              { name: "Instituto", media: 65 },
              { name: "Nueva Chicago", media: 64 },
              { name: "Patronato", media: 65 },
              { name: "Platense", media: 68 },
              { name: "Quilmes", media: 67 },
              { name: "Sarmiento (J)", media: 66 },
              { name: "Temperley", media: 67 },
              { name: "Tigre", media: 68 },
            ].map((team) => ({
              ...team,
              logo: generateLogoPath(team.name),
            })),
          },
          {
            name: "Internacional",
            teams: [
              { name: "Gibraltar", media: 40 },
              { name: "Tuvalu", media: 25 },
            ].map((team) => ({
              ...team,
              logo: generateLogoPath(team.name),
            })),
          },
          {
            name: "La Liga",
            teams: [
              { name: "Real Madrid", media: 90 },
              { name: "Sevilla", media: 82 },
              { name: "Barcelona", media: 87 },
              { name: "Atlético Madrid", media: 85 },
            ].map((team) => ({
              ...team,
              logo: generateLogoPath(team.name),
            })),
          },
          {
            name: "Premier League",
            teams: [
              { name: "Arsenal", media: 88 },
              { name: "Aston Villa", media: 82 },
              { name: "Bournemouth", media: 79 },
              { name: "Brentford", media: 79 },
              { name: "Brighton", media: 81 },
              { name: "Chelsea", media: 84 },
              { name: "Crystal Palace", media: 78 },
              { name: "Everton", media: 78 },
              { name: "Fulham", media: 78 },
              { name: "Ipswich Town", media: 73 },
              { name: "Leicester", media: 77 },
              { name: "Liverpool", media: 89 },
              { name: "Newcastle United", media: 82 },
              { name: "Nottingham Forest", media: 80 },
              { name: "Manchester City", media: 92 },
              { name: "Manchester United", media: 83 },
              { name: "Southampton", media: 75 },
              { name: "Tottenham", media: 85 },
              { name: "West Ham", media: 80 },
              { name: "Wolverhampton", media: 78 },
            ].map((team) => ({
              ...team,
              logo: generateLogoPath(team.name),
            })),
          },
        ]}
        onSelectedTeams={(local, visitante) => handleEquiposSeleccionados(local, visitante)}
      />
      <button onClick={jugarPartido} className="btn btn-primary">
        Jugar Partido
      </button>
    </div>
  );
};

export default Partido;
