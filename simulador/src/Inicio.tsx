import React from "react";
import { Link } from "react-router-dom";
import { GiSoccerKick, GiGoalKeeper } from "react-icons/gi";
import { FaEdit } from "react-icons/fa";
import "./Inicio.css";

const Inicio: React.FC = () => {
  return (
    <main className="inicio-page">
      <header className="inicio-page__header">
        <h1 className="inicio-page__title">Simulador de Partidos</h1>
        <p className="inicio-page__subtitle">Seleccioná una opción para comenzar:</p>
      </header>

      <ul className="inicio-page__grid" aria-label="Opciones de simulación">
        <li>
          <Link to="/partido" className="inicio-page__card" aria-label="Simular partido">
            <div className="inicio-page__icon"><GiSoccerKick /></div>
            <h2 className="inicio-page__cardTitle">Partido</h2>
            <p className="inicio-page__hint">90’ + agregado</p>
          </Link>
        </li>

        <li>
          <Link to="/penales" className="inicio-page__card" aria-label="Simular penales">
            <div className="inicio-page__icon"><GiGoalKeeper /></div>
            <h2 className="inicio-page__cardTitle">Penales</h2>
            <p className="inicio-page__hint">Serie desde los 12 pasos</p>
          </Link>
        </li>
      </ul>
      <div className="inicio-page__edit">
        <Link
          to="/editar"
          className="inicio-page__card inicio-page__card--edit"
          aria-label="Editar equipos"
        >
          <div className="inicio-page__icon"><FaEdit /></div>
          <div className="inicio-page__editCopy">
            <h2 className="inicio-page__cardTitle">Editar</h2>
            <p className="inicio-page__hint">Modificar ligas y medias de clubes</p>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default Inicio;
