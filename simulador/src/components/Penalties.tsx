import React, { useState, useEffect } from 'react';
import './Penalties.css';

const Penalties: React.FC = () => {
  const positions = 6;
  /*_________
    | 1 2 3 |
    | 4 5 6 |
  */

  const possibilities = 20;
  let onGoal: boolean;
  let scored: boolean;
  
  // Estado para el intervalo de tiempo (ms)
  const [interval, setInterval] = useState<number>(5000);
  // Estado para mostrar los mensajes de los penales en la UI
  const [messages, setMessages] = useState<string[]>([]);
  // Estado para controlar si la tanda está en curso
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Estado para guardar el resultado del partido
  const [matchResult, setMatchResult] = useState<string>('');
  // Equipos
  const [teamA, setTeamA] = useState<string>("River");
  const [teamB, setTeamB] = useState<string>("San Lorenzo");

  const shoot = (): number => { // Patear a una de las 6 zonas.
    return Math.floor(Math.random() * positions) + 1;
  };
  
  const shootOnGoal = (): boolean => { // Si el tiro llega o no al arco
    const result = Math.floor(Math.random() * possibilities) + 1;
    if (result <= 17) {
      onGoal = true;
    } else {
      onGoal = false;
    }
    return onGoal;
  };
  
  const dive = (): number => {
    const divePosition = Math.floor(Math.random() * positions) + 1;
    // Las posiciones 2 y 5 son equivalentes porque el arquero se queda parado en el medio.
    return divePosition === 5 ? 2 : divePosition;
  };
    
  const penaltyShot = (): boolean => {
    const shotPosition = shoot();
  
    if (shotPosition !== 5) {
      const destination = shootOnGoal();
      const goalkeeperPosition = dive();

      if (!destination) {
        scored = false;
      }
      else if (goalkeeperPosition === shotPosition) {
        const saveChance = Math.floor(Math.random() * possibilities) + 1;
        scored = saveChance > 18 ? true : false;
      }
      else {
        scored = true;
      }

    } else {
      // Tiro a la posición 2
      const goalkeeperPosition = dive();
      if (goalkeeperPosition === 2) {
        const saveChance = Math.floor(Math.random() * possibilities) + 1;
        scored = saveChance > 18 ? true : false;
      } else {
        scored = true;
      }
    }

    return scored;
  };

  const addMessage = (msg: string) => {
    setMessages(prevMessages => [...prevMessages, msg]);
    console.log(msg);
  };

  const penaltyShootout = () => {
    // Limpiar mensajes anteriores
    setMessages([]);
    setMatchResult('');
    setIsRunning(true);
    
    const rounds = 5;
    let turnoA = 1;
    let turnoB = 1;
    let teamAScore = 0;
    let teamBScore = 0;
    let estado = "A"; // A, B, SuddenA, SuddenB
    let suddenDeathRound = 1;
  
    addMessage(`${teamA} vs ${teamB} - Tanda de penales`);
  
    const intervalId = window.setInterval(() => {
      if (estado === "A") {
        if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
          addMessage(`${teamA} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
          return;
        }
  
        const teamAScored = penaltyShot();
        if (teamAScored) teamAScore++;
        addMessage(`Ronda ${turnoA}:`);
        addMessage(`${teamA} ${teamAScored ? "gol" : "erra"}! Total: ${teamAScore}.`);
  
        if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
          addMessage(`${teamA} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
          return;
        }
  
        if (teamBScore > teamAScore + (rounds - turnoA)) {
          addMessage(`${teamB} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
          return;
        }

        estado = "B";
      } else if (estado === "B") {
        const teamBScored = penaltyShot();
        if (teamBScored) teamBScore++;
        addMessage(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}.`);
  
        if (teamBScore > teamAScore + (rounds - turnoA)) {
          addMessage(`${teamB} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
          return;
        }
  
        turnoA++;
        turnoB++;
  
        if (turnoA > rounds && turnoB > rounds && teamAScore === teamBScore) {
          addMessage("Empate tras los 5 penales. Vamos a muerte súbita.");
          estado = "SuddenA";
        } else if (turnoA > rounds && turnoB > rounds) {
          const ganador = teamAScore > teamBScore ? teamA : teamB;
          addMessage(`${ganador} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
          return;
        } else {
          estado = "A";
        }
      } else if (estado === "SuddenA") {
        addMessage(`Ronda ${suddenDeathRound + 5} - Muerte súbita ${suddenDeathRound}:`);
  
        const teamAScored = penaltyShot();
        if (teamAScored) teamAScore++;
        addMessage(`${teamA} ${teamAScored ? "gol" : "erra"}! Total: ${teamAScore}`);
  
        estado = "SuddenB";
      } else if (estado === "SuddenB") {
        const teamBScored = penaltyShot();
        if (teamBScored) teamBScore++;
        addMessage(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}`);
  
        if (teamAScore !== teamBScore) {
          const ganador = teamAScore > teamBScore ? teamA : teamB;
          addMessage(`${ganador} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          clearInterval(intervalId);
          setIsRunning(false);
        } else {
          suddenDeathRound++;
          estado = "SuddenA";
        }
      }
    }, interval); // Usando el intervalo seleccionado
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(parseInt(e.target.value));
  };

  const handleTeamAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamA(e.target.value);
  };

  const handleTeamBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamB(e.target.value);
  };

  return (
    <div className="penalties-container">
      <h1>Tanda de Penales</h1>
      
      <div className="settings">
        <div className="teams-input">
          <div>
            <label>Local: </label>
            <input 
              type="text" 
              value={teamA} 
              onChange={handleTeamAChange} 
              disabled={isRunning}
            />
          </div>
          <div>
            <label>Visitante: </label>
            <input 
              type="text" 
              value={teamB} 
              onChange={handleTeamBChange} 
              disabled={isRunning}
            />
          </div>
        </div>
        
        <div className="interval-select">
          <label>Velocidad del penal: </label>
          <select value={interval} onChange={handleIntervalChange} disabled={isRunning}>
            <option value="1000">Muy rápido (1s)</option>
            <option value="2000">Rápido (2s)</option>
            <option value="3000">Normal (3s)</option>
            <option value="5000">Lento (5s)</option>
            <option value="8000">Muy lento (8s)</option>
          </select>
        </div>
      </div>
      
      <button 
        className="start-button" 
        onClick={penaltyShootout} 
        disabled={isRunning}
      >
        Iniciar penales
      </button>
      
      {matchResult && (
        <div className="match-result">
          <h2>{matchResult}</h2>
        </div>
      )}
      
      <div className="penalty-log">
        {messages.map((msg, index) => (
          <div key={index} className="penalty-message">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Penalties;