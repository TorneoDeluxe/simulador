import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaSave, FaSearch } from "react-icons/fa";
import "./Editar.css";

type Team = {
  id?: number;
  name: string;
  logo: string;
  media: number;
  ligaId: number;
  ligaNombre: string;
  pais: string;
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

type ApiLeague = {
  id: number;
  nombre: string;
  pais: string;
  categoria: number;
};

type ApiTeam = {
  id?: number;
  nombre: string;
  media: number;
  ligaId: number;
};

const EditarEquipos: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(0);
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [mediaInput, setMediaInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchMode, setSearchMode] = useState<"name" | "league">("league");

  const selectedCountry = countries[selectedCountryIndex];
  const selectedLeague = selectedCountry?.leagues[selectedLeagueIndex];

  const generateLogoPath = (name: string, country: string) => {
    const sanitizedName = name.replace(/\s+/g, "_").replace(/[()]/g, "");
    return new URL(`./assets/Escudos/${country}/${sanitizedName}.png`, import.meta.url).href;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const ligasResponse = await fetch("https://localhost:7225/api/ligas");
        const equiposResponse = await fetch("https://localhost:7225/api/equipos");

        const ligas: ApiLeague[] = await ligasResponse.json();
        const equipos: ApiTeam[] = await equiposResponse.json();

        const ligasPorId = new Map(ligas.map((liga) => [liga.id, liga]));

        const equiposConDetalles: Team[] = equipos.map((eq) => {
          const liga = ligasPorId.get(eq.ligaId);
          const pais = liga?.pais ?? "Otros";
          return {
            id: eq.id,
            name: eq.nombre,
            media: eq.media,
            ligaId: eq.ligaId,
            ligaNombre: liga?.nombre ?? "",
            pais,
            logo: generateLogoPath(eq.nombre, pais),
          };
        });

        const ligasConEquipos: League[] = ligas.map((liga) => ({
          ...liga,
          teams: equiposConDetalles
            .filter((eq) => eq.ligaId === liga.id)
            .sort((a, b) => a.name.localeCompare(b.name)),
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
        setAllTeams(equiposConDetalles.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setStatus({ type: "error", message: "No pudimos cargar los equipos. Intentá nuevamente." });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      setMediaInput(String(selectedTeam.media));
    }
  }, [selectedTeam]);

  const filteredTeams = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return allTeams.filter((team) => team.name.toLowerCase().includes(term));
  }, [allTeams, searchTerm]);

  const handleTeamSelection = (team: Team) => {
    setSelectedTeam(team);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedTeam) return;

    const nuevaMedia = Number(mediaInput);
    if (!Number.isInteger(nuevaMedia) || nuevaMedia < 1 || nuevaMedia > 99) {
      setStatus({ type: "error", message: "La media debe ser un número entre 1 y 99." });
      return;
    }

    if (!selectedTeam.id) {
      setStatus({ type: "error", message: "No encontramos el identificador del equipo." });
      return;
    }

    try {
      setSaving(true);
      setStatus({ type: "", message: "" });
      const response = await fetch(`https://localhost:7225/api/equipos/${selectedTeam.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTeam.id,
          nombre: selectedTeam.name,
          media: nuevaMedia,
          ligaId: selectedTeam.ligaId,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el equipo");
      }

      setSelectedTeam({ ...selectedTeam, media: nuevaMedia });
      setAllTeams((prev) =>
        prev.map((team) => (team.id === selectedTeam.id ? { ...team, media: nuevaMedia } : team))
      );
      setCountries((prevCountries) =>
        prevCountries.map((country) => ({
          ...country,
          leagues: country.leagues.map((league) => ({
            ...league,
            teams: league.teams.map((team) =>
              team.id === selectedTeam.id ? { ...team, media: nuevaMedia } : team
            ),
          })),
        }))
      );
      setStatus({ type: "success", message: "Media actualizada correctamente." });
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Hubo un problema al guardar. Probá nuevamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleCountryChange = (index: number) => {
    setSelectedCountryIndex(index);
    setSelectedLeagueIndex(0);
  };

  const handleLeagueChange = (index: number) => {
    setSelectedLeagueIndex(index);
  };

  return (
    <main className="editar-page">
      <header className="editar-page__header">
        <div className="editar-page__titleBlock">
          <Link to="/" className="editar-page__back">
            <FaArrowLeft aria-hidden /> Volver a Inicio
          </Link>
          <h1 className="editar-page__title">Editar equipos</h1>
        </div>
      </header>

      {loading ? (
        <div className="editar-page__empty">Cargando equipos...</div>
      ) : (
        <div className="editar-page__layout">
          <div className="editar-page__content">
            <div className="editar-toggle" role="tablist" aria-label="Modo de búsqueda">
                <button
                  type="button"
                  role="tab"
                  aria-selected={searchMode === "name"}
                  className={`editar-toggle__option ${searchMode === "name" ? "is-active" : ""}`}
                  onClick={() => setSearchMode("name")}
                >
                  Buscar por nombre
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={searchMode === "league"}
                  className={`editar-toggle__option ${searchMode === "league" ? "is-active" : ""}`}
                  onClick={() => setSearchMode("league")}
                >
                  Buscar por liga
                </button>
              </div>
              {searchMode === "name" ? (
              <section className="editar-panel">
                <div className="editar-panel__header">
                  <FaSearch aria-hidden />
                  <div>
                    <h2>Buscar por nombre</h2>
                    <p>Escribí el nombre del club para filtrar al instante.</p>
                  </div>
             </div>
                <div className="editar-panel__search">
                  <input
                    type="text"
                    placeholder="Ej: Ars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar equipo por nombre"
                  />
                </div>
                <div className="editar-panel__results" aria-live="polite">
                  {searchTerm && filteredTeams.length === 0 && (
                    <p className="editar-page__empty">No hay equipos que coincidan con tu búsqueda.</p>
                  )}
                  <div className="editar-team-grid">
                    {filteredTeams.map((team) => (
                      <button
                        key={`${team.id ?? team.name}-search`}
                        className={`editar-team-card ${selectedTeam?.name === team.name ? "is-active" : ""}`}
                        onClick={() => handleTeamSelection(team)}
                      >
                        <div className="editar-team-card__info">
                          <span className="editar-team-card__name">{team.name}</span>
                          <span className="editar-team-card__meta">{team.pais} · {team.ligaNombre}</span>
                        </div>
                        <span className="editar-team-card__media">{team.media}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            ) : (
              <section className="editar-panel editar-panel--league">
                <div className="editar-panel__header">
                  <FaEdit aria-hidden />
                  <div>
                    <h2>Seleccionar por liga</h2>
                    <p>Elegí país y competición para ver todos los clubes.</p>
                  </div>
                </div>
                <div className="editar-panel__selectors">
                  <label>
                    <span>País</span>
                    <select
                      value={selectedCountryIndex}
                      onChange={(e) => handleCountryChange(Number(e.target.value))}
                    >
                      {countries.map((country, index) => (
                        <option key={country.name} value={index}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Liga</span>
                    <select
                      value={selectedLeagueIndex}
                      onChange={(e) => handleLeagueChange(Number(e.target.value))}
                    >
                      {selectedCountry?.leagues.map((league, index) => (
                        <option key={league.id} value={index}>
                          {league.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="editar-team-grid editar-team-grid--wide">
                  {selectedLeague?.teams.map((team) => (
                    <button
                      key={`${team.id ?? team.name}-league`}
                      className={`editar-team-card ${selectedTeam?.name === team.name ? "is-active" : ""}`}
                      onClick={() => handleTeamSelection(team)}
                    >
                      <div className="editar-team-card__info">
                        <span className="editar-team-card__name">{team.name}</span>
                        <span className="editar-team-card__meta">{team.pais} · {team.ligaNombre}</span>
                      </div>
                      <span className="editar-team-card__media">{team.media}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <section className="editar-panel editar-panel--form">
            <div className="editar-panel__header">
              <FaSave aria-hidden />
              <div>
                <h2>Actualizar media</h2>
              </div>
            </div>
            {selectedTeam ? (
              <form className="editar-form" onSubmit={handleSubmit}>
                <div className="editar-form__team">
                  <img src={selectedTeam.logo} alt="Escudo" />
                  <div>
                    <p className="editar-form__teamName">{selectedTeam.name}</p>
                    <p className="editar-form__teamMeta">{selectedTeam.pais} · {selectedTeam.ligaNombre}</p>
                  </div>
                </div>
                <label className="editar-form__field">
                  <span>Nueva media (1 a 99)</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={mediaInput}
                    onChange={(e) => setMediaInput(e.target.value)}
                    required
                  />
                </label>
                {status.message && (
                  <p
                    className={`editar-form__status ${status.type === "error" ? "is-error" : "is-success"}`}
                    role="status"
                  >
                    {status.message}
                  </p>
                )}
                <button type="submit" className="editar-form__submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            ) : (
              <p className="editar-page__empty">Elegí un equipo para editar su media.</p>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default EditarEquipos;