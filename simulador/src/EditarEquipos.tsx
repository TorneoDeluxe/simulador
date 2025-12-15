import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaRandom, FaSearch } from "react-icons/fa";
import "./Editar.css";
import { getTeamLogoPath } from "./utils/logoPath";

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
  const [leagueStatus, setLeagueStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchMode, setSearchMode] = useState<"name" | "league">("league");
  const [editMode, setEditMode] = useState<"teams" | "leagues">("teams");
  const [draggedTeam, setDraggedTeam] = useState<{ teamId: number; fromLeagueId: number } | null>(null);
  const [hoveredLeagueId, setHoveredLeagueId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ teamId: number; leagueId: number } | null>(null);

  const selectedCountry = countries[selectedCountryIndex];
  const selectedLeague = selectedCountry?.leagues[selectedLeagueIndex];
  const leaguesInSelectedCountry = selectedCountry?.leagues ?? [];

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
            logo: getTeamLogoPath(eq.nombre, pais),
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

  const leaguesByCategory = useMemo(() => {
    const country = countries[selectedCountryIndex];
    if (!country) return [];

    const grouped = new Map<number, League[]>();
    country.leagues.forEach((league) => {
      const current = grouped.get(league.categoria) ?? [];
      grouped.set(league.categoria, [...current, league]);
    });

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([categoria, leagues]) => ({
        categoria,
        leagues: [...leagues].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      }));
  }, [countries, selectedCountryIndex]);

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

  const handleDragStart = (team: Team, leagueId: number) => {
    if (!team.id) return;
    setDraggedTeam({ teamId: team.id, fromLeagueId: leagueId });
    setLeagueStatus({ type: "", message: "" });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, leagueId: number) => {
    event.preventDefault();
    if (draggedTeam?.fromLeagueId !== leagueId) {
      setHoveredLeagueId(leagueId);
    }
  };

  const handleDragLeave = () => {
    setHoveredLeagueId(null);
  };

  const findLeagueLocation = (leagueId: number) => {
    for (const country of countries) {
      const league = country.leagues.find((l) => l.id === leagueId);
      if (league) {
        return { country, league };
      }
    }
    return null;
  };

  const findTeamLocation = (teamId: number) => {
    for (const country of countries) {
      for (const league of country.leagues) {
        const team = league.teams.find((t) => t.id === teamId);
        if (team) {
          return { country, league, team };
        }
      }
    }
    return null;
  };

  const moveTeamToLeague = async (teamId: number, targetLeagueId: number) => {
    const teamLocation = findTeamLocation(teamId);
    const targetLocation = findLeagueLocation(targetLeagueId);

    if (!teamLocation || !targetLocation) {
      setLeagueStatus({ type: "error", message: "No encontramos la liga o el club seleccionado." });
      return;
    }

    const { country, league: originLeague, team } = teamLocation;
    const { country: targetCountry, league: targetLeague } = targetLocation;

    if (country.name !== targetCountry.name) {
      setLeagueStatus({ type: "error", message: "Solo podés mover clubes dentro del mismo país." });
      return;
    }

    if (!team.id) {
      setLeagueStatus({ type: "error", message: "El club seleccionado no tiene identificador válido." });
      return;
    }

    try {
      setSaving(true);
      setLeagueStatus({ type: "", message: "" });
      const response = await fetch(`https://localhost:7225/api/equipos/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: team.id,
          nombre: team.name,
          media: team.media,
          ligaId: targetLeague.id,
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo mover el club");
      }

      setCountries((prevCountries) =>
        prevCountries.map((countryItem) => ({
          ...countryItem,
          leagues: countryItem.leagues.map((leagueItem) => {
            if (leagueItem.id === originLeague.id) {
              return { ...leagueItem, teams: leagueItem.teams.filter((t) => t.id !== team.id) };
            }
            if (leagueItem.id === targetLeague.id) {
              const updatedTeams = [...leagueItem.teams.filter((t) => t.id !== team.id),
                { ...team, ligaId: targetLeague.id, ligaNombre: targetLeague.nombre }];
              updatedTeams.sort((a, b) => a.name.localeCompare(b.name));
              return { ...leagueItem, teams: updatedTeams };
            }
            return leagueItem;
          }),
        }))
      );

      setAllTeams((prev) =>
        prev.map((t) =>
          t.id === team.id
            ? { ...t, ligaId: targetLeague.id, ligaNombre: targetLeague.nombre, pais: targetLeague.pais }
            : t
        )
      );

      if (selectedTeam?.id === team.id) {
        setSelectedTeam({ ...selectedTeam, ligaId: targetLeague.id, ligaNombre: targetLeague.nombre });
      }

      setLeagueStatus({ type: "success", message: `${team.name} ahora juega en ${targetLeague.nombre}.` });
    } catch (error) {
      console.error(error);
      setLeagueStatus({ type: "error", message: "Hubo un problema al mover el club." });
    } finally {
      setSaving(false);
      setDraggedTeam(null);
      setHoveredLeagueId(null);
      setContextMenu(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, leagueId: number) => {
    event.preventDefault();
    if (draggedTeam && draggedTeam.fromLeagueId !== leagueId) {
      moveTeamToLeague(draggedTeam.teamId, leagueId);
    }
    setHoveredLeagueId(null);
  };

  const openContextMenu = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    teamId: number,
    leagueId: number
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu((prev) =>
      prev && prev.teamId === teamId && prev.leagueId === leagueId ? null : { teamId, leagueId }
    );
  };


  return (
    <main className="editar-page">
      <header className="editar-page__header">
        <div className="editar-page__titleBlock">
          <Link to="/" className="editar-page__back backbutton">
            <FaArrowLeft aria-hidden /> Volver a Inicio
          </Link>
          <h1 className="editar-page__title">Editar</h1>
          <p className="editar-page__subtitle">
            Actualizá medias individuales o mové equipos entre ligas de una misma federación.
          </p>
        </div>
      </header>

      <div className="editar-toggle" role="tablist" aria-label="Modo de edición">
        <button
          type="button"
          role="tab"
          aria-selected={editMode === "teams"}
          className={`editar-toggle__option ${editMode === "teams" ? "is-active" : ""}`}
          onClick={() => setEditMode("teams")}
        >
          Editar equipos
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={editMode === "leagues"}
          className={`editar-toggle__option ${editMode === "leagues" ? "is-active" : ""}`}
          onClick={() => setEditMode("leagues")}
        >
          Editar ligas
        </button>
      </div>

      {loading ? (
        <div className="editar-page__empty">Cargando equipos...</div>
      ) : editMode === "teams" ? (
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
                    <select className="editar-panel__select"
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
                    <select className="editar-panel__select"
                      value={selectedLeagueIndex}
                      onChange={(e) => handleLeagueChange(Number(e.target.value))}
                    >
                      {leaguesInSelectedCountry.map((league, index) => (
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
              <FaEdit aria-hidden />
              <div>
                <h2>Editar media</h2>
              </div>
            </div>
            {selectedTeam ? (
              <form className="editar-form" onSubmit={handleSubmit}>
                <div className="editar-form__team">
                  <img src={selectedTeam.logo} alt="Escudo" />
                  <div className="editar-form__teamInfo">
                    <p className="editar-form__teamName">{selectedTeam.name}</p>
                    <p className="editar-form__teamMeta">{selectedTeam.pais} · {selectedTeam.ligaNombre}</p>
                  </div>
                  <div className="editar-form__teamMedia" aria-label="Media actual">
                    {selectedTeam.media}
                  </div>
                </div>
                <label className="editar-form__field">
                  <span>Media (entre 1 y 99)</span>
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
         ) : (
        <section className="editar-panel editar-panel--wide">
          <div className="editar-panel__header">
            <FaRandom aria-hidden />
            <div>
              <h2>Editar ligas</h2>
              <p>Ordená clubes por categoría y movelos a otra liga del mismo país.</p>
            </div>
          </div>
          <div className="editar-panel__selectors">
            <label>
              <span>País</span>
              <select
                className="editar-panel__select"
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
          </div>
          <p className="editar-page__hint">
            Arrastrá un club hacia otra liga de la misma categoría o usá el menú contextual para moverlo.
          </p>
          {leagueStatus.message && (
            <p
              className={`editar-form__status ${leagueStatus.type === "error" ? "is-error" : "is-success"}`}
              role="status"
            >
              {leagueStatus.message}
            </p>
          )}
          <div className="editar-league__board" onClick={() => setContextMenu(null)}>
            {leaguesInSelectedCountry.length === 0 ? (
              <p className="editar-page__empty">No hay ligas cargadas para este país.</p>
            ) : (
              leaguesByCategory.map(({ categoria, leagues }) => (
                <div key={`cat-${categoria}`} className="editar-league__category">
                  <div className="editar-league__categoryHeader">
                    <h3>Categoria {categoria}</h3>
                    <span>{leagues.length} {leagues.length === 1 ? "liga" : "ligas"}</span>
                  </div>
                  <div className="editar-league__lanes">
                    {leagues.map((league) => (
                      <div
                        key={league.id}
                        className={`editar-league__lane ${hoveredLeagueId === league.id ? "is-hovered" : ""}`}
                        onDragOver={(event) => handleDragOver(event, league.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(event) => handleDrop(event, league.id)}
                      >
                        <div className="editar-league__laneHeader">
                          <div>
                            <p className="editar-league__laneTitle">{league.nombre}</p>
                            <span className="editar-league__laneMeta">Equipos: {league.teams.length}</span>
                          </div>
                          <span className="editar-league__laneCategory">Cat. {league.categoria}</span>
                        </div>
                        <div className="editar-league__teamList">
                          {league.teams.length === 0 && (
                            <p className="editar-page__empty">Arrastrá un club a esta liga</p>
                          )}
                          {league.teams.map((team) => (
                            <div
                              key={`${team.id ?? team.name}-lane`}
                              className="editar-league__teamCard"
                              draggable
                              onDragStart={() => handleDragStart(team, league.id)}
                              onContextMenu={(event) => team.id && openContextMenu(event, team.id, league.id)}
                            >
                              <div className="editar-league__teamInfo">
                                <img src={team.logo} alt="Escudo" />
                                <div>
                                  <p className="editar-league__teamName">{team.name}</p>
                                  <span className="editar-league__teamMeta">Media: {team.media}</span>
                                </div>
                              </div>
                              <div className="editar-league__teamActions">
                                <button
                                  type="button"
                                  className="editar-league__action"
                                  onClick={(event) => team.id && openContextMenu(event, team.id, league.id)}
                                >
                                  ⋯
                                </button>
                                {contextMenu?.teamId === team.id && contextMenu?.leagueId === league.id && (
                                  <div
                                    className="editar-league__menu"
                                    onClick={(event) => event.stopPropagation()}
                                    onMouseLeave={() => setContextMenu(null)}
                                  >
                                    <p className="editar-league__menuTitle">Mover a:</p>
                                    {leaguesInSelectedCountry
                                      .filter((targetLeague) => targetLeague.id !== league.id)
                                      .map((targetLeague) => (
                                        <button
                                          type="button"
                                          key={`${team.id}-${targetLeague.id}`}
                                          onClick={() => team.id && moveTeamToLeague(team.id, targetLeague.id)}
                                        >
                                          {targetLeague.nombre} (Cat. {targetLeague.categoria})
                                        </button>
                                      ))}
                                    {leaguesInSelectedCountry.length === 1 && (
                                      <span className="editar-page__empty">No hay otras ligas en este país</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default EditarEquipos;