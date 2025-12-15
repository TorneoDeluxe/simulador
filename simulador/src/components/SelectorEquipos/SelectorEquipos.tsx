// src/components/SelectorEquipos/SelectorEquipos.tsx
import React, { useEffect, useState } from "react";
import "./SelectorEquipos.css";
import { getTeamLogoPath } from "../../utils/logoPath";

interface Team {
  name: string;
  logo: string;
  media: number;
}

interface League {
  id: number;
  nombre: string;
  pais: string;
  categoria: number;
  teams?: Team[];
}

interface Country {
  name: string;
  leagues: League[];
}

type Props = {
  onSelectedTeam: (team: Team) => void;
  selectedTeam?: Team | null;
};

const SelectorEquipos: React.FC<Props> = ({ onSelectedTeam, selectedTeam }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(2);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);

  const selectedCountry = countries[selectedCountryIndex];
  const selectedLeague = selectedCountry?.leagues[selectedLeagueIndex];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ligasResponse = await fetch("https://localhost:7225/api/ligas");
        const equiposResponse = await fetch("https://localhost:7225/api/equipos");

        const ligas: League[] = await ligasResponse.json();
        const equipos = await equiposResponse.json();

        const ligasConEquipos: League[] = ligas.map((liga) => ({
          ...liga,
          teams: equipos
            .filter((eq: any) => eq.ligaId === liga.id)
            .map((eq: any) => ({
              name: eq.nombre,
              media: eq.media,
              logo: getTeamLogoPath(eq.nombre, liga.pais),
            })),
        }));

        const agrupadoPorPais: Country[] = [];
        ligasConEquipos.forEach((liga) => {
          const paisExistente = agrupadoPorPais.find((c) => c.name === liga.pais);
          if (paisExistente) {
            paisExistente.leagues.push(liga);
          } else {
            agrupadoPorPais.push({ name: liga.pais, leagues: [liga] });
          }
        });

        agrupadoPorPais.sort((a, b) => a.name.localeCompare(b.name));
        agrupadoPorPais.forEach((pais) => {
          pais.leagues.sort((a, b) => a.categoria - b.categoria);
        });

        setCountries(agrupadoPorPais);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedTeam || countries.length === 0) return;

    const countryIndex = countries.findIndex((country) =>
      country.leagues.some((league) =>
        league.teams?.some((team) => team.name === selectedTeam.name)
      )
    );

    if (countryIndex === -1) return;

    const leagueIndex = countries[countryIndex].leagues.findIndex((league) =>
      league.teams?.some((team) => team.name === selectedTeam.name)
    );

    if (leagueIndex === -1) return;

    setSelectedCountryIndex(countryIndex);
    setSelectedLeagueIndex(leagueIndex);
  }, [countries, selectedTeam]);

  const handleSeleccion = (equipo: Team) => {
    onSelectedTeam(equipo);
  };

  const siguientePais = () => {
    setSelectedCountryIndex((prev) => (prev + 1) % countries.length);
    setSelectedLeagueIndex(0);
  };

  const anteriorPais = () => {
    setSelectedCountryIndex((prev) => (prev - 1 + countries.length) % countries.length);
    setSelectedLeagueIndex(0);
  };

  const siguienteLiga = () => {
    if (!selectedCountry) return;
    setSelectedLeagueIndex((prev) => (prev + 1) % selectedCountry.leagues.length);
  };

  const anteriorLiga = () => {
    if (!selectedCountry) return;
    setSelectedLeagueIndex((prev) => (prev - 1 + selectedCountry.leagues.length) % selectedCountry.leagues.length);
  };

  return (
    <div className="selector-equipos">
      {/* Navegación de países */}
      <div className="paises-navegacion">
        <button onClick={anteriorPais} disabled={countries.length <= 1}>{"<"}</button>
        <span>{selectedCountry?.name}</span>
        <button onClick={siguientePais} disabled={countries.length <= 1}>{">"}</button>
      </div>

      {/* Navegación de ligas */}
      <div className="ligas-navegacion">
        <button onClick={anteriorLiga}>{"<"}</button>
        <span>{selectedLeague?.nombre}</span>
        <button onClick={siguienteLiga}>{">"}</button>
      </div>

      {/* Equipos */}
      <div className="equipos-grid">
        {selectedLeague?.teams
          ?.slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((equipo) => (
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
