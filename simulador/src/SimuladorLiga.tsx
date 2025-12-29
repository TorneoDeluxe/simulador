import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { getTeamLogoPath } from "./utils/logoPath";
import "./SimuladorLiga.css";

type Team = {
  name: string;
  media: number;
  logo: string;
};

type League = {
  id: number;
  nombre: string;
  pais: string;
  categoria: number;
  teams: Team[];
};

type Country = {
  name: string;
  leagues: League[];
};

type Standing = {
  team: Team;
  points: number;
  wins: number;
  draws: number;
  losses: number;
};

const DEFAULT_MATCHDAYS = 19;

const SimuladorLiga: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);
  const [matchdays, setMatchdays] = useState(DEFAULT_MATCHDAYS);
  const [standings, setStandings] = useState<Standing[]>([]);

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
          pais.leagues.sort((a, b) => a.categoria - b.categoria || a.nombre.localeCompare(b.nombre));
        });

        setCountries(agrupadoPorPais);
        setSelectedCountryIndex(0);
        setSelectedLeagueIndex(0);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedLeague) return;
    const defaultMatchdays = Math.max(1, selectedLeague.teams.length - 1);
    setMatchdays(defaultMatchdays || DEFAULT_MATCHDAYS);
    setStandings([]);
  }, [selectedLeague?.id]);

  useEffect(() => {
    if (countries.length === 0) return;
    setSelectedLeagueIndex(0);
    setStandings([]);
  }, [countries, selectedCountryIndex]);

  const mediaRange = useMemo(() => {
    if (!selectedLeague?.teams?.length) {
      return { min: 0, max: 0 };
    }
    const values = selectedLeague.teams.map((team) => team.media);
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [selectedLeague]);

  const throwDice = () => Math.floor(Math.random() * 100) + 1;

  const computeThresholds = (media: number) => {
    const { min, max } = mediaRange;
    const ratio = max === min ? 0.5 : (media - min) / (max - min);
    const winChance = 25 + ratio * 45;
    const drawWindow = 25 - ratio * 10;
    const drawChance = Math.min(95, winChance + drawWindow);
    return { winChance, drawChance };
  };

  const simulateLeague = () => {
    if (!selectedLeague?.teams?.length) return;

    const fechas = Math.max(1, matchdays);

    const nextStandings = selectedLeague.teams.map((team) => {
      const { winChance, drawChance } = computeThresholds(team.media);
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let points = 0;

      for (let i = 0; i < fechas; i += 1) {
        const roll = throwDice();
        if (roll <= winChance) {
          wins += 1;
          points += 3;
        } else if (roll <= drawChance) {
          draws += 1;
          points += 1;
        } else {
          losses += 1;
        }
      }

      return { team, points, wins, draws, losses };
    });

    nextStandings.sort((a, b) =>
      b.points - a.points || b.team.media - a.team.media || a.team.name.localeCompare(b.team.name)
    );

    setStandings(nextStandings);
  };

  const resetSimulation = () => {
    setStandings([]);
  };

  const goBack = () => navigate("/");

  const champion = standings[0];
  const relegated = standings.slice(-3);

  return (
    <main className="liga-page">
      <button className="backbutton" onClick={goBack}>
        <FaArrowLeft aria-hidden />
        Volver a Inicio
      </button>

      <header className="liga-page__header">
        <h1>Simulación rápida de ligas</h1>
        <p>
          La simulación usa la media del club como referencia: a mayor media, mejores chances de
          sumar puntos en cada fecha.
        </p>
      </header>

      <section className="liga-page__selectors">
        <div className="liga-page__selector">
          <span className="liga-page__label">País</span>
          <div className="liga-page__nav">
            <button
              onClick={() => setSelectedCountryIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedCountryIndex === 0}
            >
              {"<"}
            </button>
            <span>{selectedCountry?.name ?? "Sin datos"}</span>
            <button
              onClick={() => setSelectedCountryIndex((prev) => Math.min(countries.length - 1, prev + 1))}
              disabled={selectedCountryIndex >= countries.length - 1}
            >
              {">"}
            </button>
          </div>
        </div>

        <div className="liga-page__selector">
          <span className="liga-page__label">Liga</span>
          <div className="liga-page__nav">
            <button
              onClick={() => setSelectedLeagueIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedLeagueIndex === 0}
            >
              {"<"}
            </button>
            <span>{selectedLeague?.nombre ?? "Sin ligas"}</span>
            <button
              onClick={() =>
                setSelectedLeagueIndex((prev) =>
                  Math.min((selectedCountry?.leagues.length ?? 1) - 1, prev + 1)
                )
              }
              disabled={selectedLeagueIndex >= (selectedCountry?.leagues.length ?? 1) - 1}
            >
              {">"}
            </button>
          </div>
        </div>

        <div className="liga-page__selector">
          <label className="liga-page__label" htmlFor="matchdays">
            Fechas simuladas
          </label>
          <input
            id="matchdays"
            className="liga-page__input"
            type="number"
            min={1}
            value={matchdays}
            onChange={(event) => setMatchdays(Number(event.target.value))}
          />
        </div>
      </section>

      <section className="liga-page__actions">
        <button
          className="liga-page__button"
          onClick={simulateLeague}
          disabled={!selectedLeague?.teams?.length}
        >
          Simular liga
        </button>
        <button
          className="liga-page__button liga-page__button--secondary"
          onClick={resetSimulation}
          disabled={standings.length === 0}
        >
          Limpiar
        </button>
      </section>

      <section className="liga-page__content">
        <div className="liga-page__standings">
          <h2>Resultados</h2>
          {standings.length === 0 ? (
            <p className="liga-page__empty">Todavía no hay simulación para mostrar.</p>
          ) : (
            <ol>
              {standings.map((entry, index) => (
                <li key={entry.team.name} className={index === 0 ? "is-champion" : ""}>
                  <img src={entry.team.logo} alt={entry.team.name} />
                  <div>
                    <strong>{entry.team.name}</strong>
                    <span className="liga-page__meta">
                      Media {entry.team.media} · PJ {matchdays} · G {entry.wins} · E {entry.draws} · P {entry.losses}
                    </span>
                  </div>
                  <span className="liga-page__points">{entry.points} pts</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside className="liga-page__summary">
          <h2>Resumen</h2>
          {champion ? (
            <div className="liga-page__summaryCard">
              <h3>Campeón</h3>
              <p>{champion.team.name}</p>
              <span>{champion.points} pts</span>
            </div>
          ) : (
            <p className="liga-page__empty">Simulá una liga para ver el campeón.</p>
          )}

          {standings.length >= 3 && (
            <div className="liga-page__summaryCard">
              <h3>Descensos</h3>
              <ul>
                {relegated.map((entry) => (
                  <li key={entry.team.name}>{entry.team.name}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default SimuladorLiga;