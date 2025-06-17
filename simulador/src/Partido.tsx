// src/pages/Partido.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SelectorEquipos from "./components/SelectorEquipos/SelectorEquipos";
import "./components/Partido.css";

type Liga = {
  id: number;
  nombre: string;
  paisId: number;
  categoria: number;
  cantidadEquipos: number;
};

type Equipo = {
  id: number;
  nombre: string;
  media: number;
  ligaId: number;
  paisId: number;
};

const Partido: React.FC = () => {
  const navigate = useNavigate();
  const [equipoLocal, setEquipoLocal] = useState<any | null>(null);
  const [equipoVisitante, setEquipoVisitante] = useState<any | null>(null);
  const [ligas, setLigas] = useState<Liga[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [ligasConEquipos, setLigasConEquipos] = useState<any[]>([]);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await fetch("https://localhost:7225/api/equipos");
        const data = await response.json();
        console.log("Datos de equipos recibidos:", data);
        return data; // 👈 Retornar los datos
      } catch (error) {
        console.error("Error al cargar equipos:", error);
        return []; // 👈 En caso de error, retornar array vacío
      }
    };
  
    const fetchLigas = async () => {
      try {
        const response = await fetch("https://localhost:7225/api/ligas");
        const data = await response.json();
        console.log("Datos de ligas recibidos:", data);
        return data; // 👈 Retornar los datos
      } catch (error) {
        console.error("Error al cargar ligas:", error);
        return [];
      }
    };
  
    const cargarDatos = async () => {
      const ligasResponse = await fetchLigas();
      const equiposResponse = await fetchEquipos();
  
      setLigas(ligasResponse);
      setEquipos(equiposResponse);
    };
  
    cargarDatos();
  }, []);
  
  useEffect(() => {
    if (ligas.length > 0 && equipos.length > 0) {
      const resultado = ligas.map((liga) => {
        const equiposDeEstaLiga = equipos
          .filter((equipo) => equipo.ligaId === liga.id)
          .map((equipo) => ({
            name: equipo.nombre,
            media: equipo.media,
            logo: generateLogoPath(equipo.nombre),
          }));
  
        return {
          name: liga.nombre,
          teams: equiposDeEstaLiga,
        };
      });
  
      setLigasConEquipos(resultado);
    }
  }, [ligas, equipos]);
  
  
  const jugarPartido = () => {
    if (equipoLocal && equipoVisitante) {
      navigate("/partido/simulacion", {
        state: { local: equipoLocal, visitante: equipoVisitante },
      });
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

      <div className="partido-container">
        <div className="selector-local">
          <h5>Equipo Local</h5>
          {ligasConEquipos.length > 0 && (
            <SelectorEquipos ligas={ligasConEquipos} onSelectedTeam={setEquipoLocal} />
          )}
        </div>

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

        <div className="selector-visitante">
            <h5>Equipo Visitante</h5>
            {ligasConEquipos.length > 0 && (
              <SelectorEquipos ligas={ligasConEquipos} onSelectedTeam={setEquipoVisitante} />
            )}
        </div>

      </div>
    </div>
  );
};

export default Partido;
