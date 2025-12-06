// src/components/SelectorEquipos/SelectorEquipos.tsx
import React, { useEffect, useState } from "react";
import "./SelectorEquipos.css";
import { HARDCODED_COUNTRIES } from "../../data/hardcodedCountries";

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
};

const SelectorEquipos: React.FC<Props> = ({ onSelectedTeam }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(2);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);

  const selectedCountry = countries[selectedCountryIndex];
  const selectedLeague = selectedCountry?.leagues[selectedLeagueIndex];

  useEffect(() => {
    // Transformo los datos hardcodeados en el mismo modelo que usa el componente
    const countriesWithLogos: Country[] = HARDCODED_COUNTRIES.map((country) => ({
      name: country.name,
      leagues: country.leagues.map((league) => ({
        ...league,
        teams: league.teams.map((team) => ({
          ...team,
          logo: generateLogoPath(team.name, league.pais),
        })),
      })),
    }));

    // si querés, podés ordenar igual que antes:
    countriesWithLogos.sort((a, b) => a.name.localeCompare(b.name));
    countriesWithLogos.forEach((pais) => {
      pais.leagues.sort((a, b) => a.categoria - b.categoria);
    });

    setCountries(countriesWithLogos);
  }, []);

  const generateLogoPath = (name: string, country: string ) => {
    const sanitizedName = name.replace(/\s+/g, "_").replace(/[()]/g, "");
    return new URL(`../../assets/Escudos/${country}/${sanitizedName}.png`, import.meta.url).href;
  };

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
