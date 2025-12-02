import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Penalties.css';

interface PenaltyRound {
  teamA: boolean | null;
  teamB: boolean | null;
}

type Team = {
  name: string;
  logo: string;
  media: number;
};

const Penalties: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = location.state as { local?: Team; visitante?: Team };
  const positions = 6;
  const possibilities = 20;
  let scored: boolean;
  
  // Estado para el intervalo de tiempo (ms)
  const [interval, setInterval] = useState<number>(5000);
  // Estado para mostrar los mensajes de los penales en la UI
  const [, setMessages] = useState<string[]>([]);
  // Estado para controlar si la tanda está en curso
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // Estado para guardar el resultado del partido
  const [matchResult, setMatchResult] = useState<string>('');
  // Equipos
  const [teamA] = useState<string>(navigationState?.local?.name ?? "River");
  const [teamB] = useState<string>(navigationState?.visitante?.name ?? "San Lorenzo");
  // Estado para los penales individuales
  const [penaltyRounds, setPenaltyRounds] = useState<PenaltyRound[]>([]);
  // Estado para los totales
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  // Estado para control de ronda actual
  const [currentRound, setCurrentRound] = useState<number>(0);

  // Estados para la participación del usuario
  const [userWillShoot, setUserWillShoot] = useState<boolean>(false); 
  const [userTeam, setUserTeam] = useState<string>("teamA");
  const [userRound, setUserRound] = useState<number | string>(1);
  const [isUserTurn, setIsUserTurn] = useState<boolean>(false);
  const [userShotOptions, setUserShotOptions] = useState<boolean>(false);
  const userShotResultRef = useRef<boolean | null>(null);
  const continueShootoutRef = useRef<() => void>(() => {
    console.log("Si llegaste acá, está mal.");
  });

  const shoot = (): number => { return Math.floor(Math.random() * positions) + 1; };  // Patear a una de las 6 zonas. 
  
  const shootOnGoal = (): boolean => { // Si el tiro llega o no al arco
    let onGoal = false;
    const result = Math.floor(Math.random() * possibilities) + 1;
    if (result <= 17) {
      onGoal = true;
    }
    return onGoal;
  };
  
  const dive = (): number => {
    const divePosition = Math.floor(Math.random() * positions) + 1;
    // Las posiciones 2 y 5 son equivalentes porque el arquero se queda parado en el medio.
    return divePosition === 5 ? 2 : divePosition;
  };
    
  const penaltyShot = (userSelectedPosition?: number): boolean => {
    // Usar la posición seleccionada por el usuario si está disponible, de lo contrario elegir aleatoriamente
    const shotPosition = userSelectedPosition !== undefined ? userSelectedPosition : shoot();
  
    if (shotPosition !== 5) {
      const destination = shootOnGoal();
      const goalkeeperPosition = dive();

      if (!destination) {
        scored = false;
      }
      else if (goalkeeperPosition === shotPosition) {
        const saveChance = Math.floor(Math.random() * possibilities) + 1;
        scored = saveChance > 18;
      }
      else {
        scored = true;
      }

    } else {
      // Tiro a la posición 2
      const goalkeeperPosition = dive();
      if (goalkeeperPosition === 2) {
        const saveChance = Math.floor(Math.random() * possibilities) + 1;
        scored = saveChance > 18;
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

  // Función para actualizar el resultado de un penal en la tabla
  const updatePenaltyResult = (team: 'teamA' | 'teamB', scored: boolean, round: number) => {
    setPenaltyRounds(prevRounds => {
      const newRounds = [...prevRounds];
      // Si la ronda no existe, creamos todas las necesarias hasta esa ronda
      while (newRounds.length <= round) {
        newRounds.push({ teamA: null, teamB: null });
      }
      
      // Actualizamos el resultado del penal
      newRounds[round] = {
        ...newRounds[round],
        [team]: scored
      };
      
      return newRounds;
    });
    
    // Actualizamos el marcador total
    if (team === 'teamA' && scored) {
      setScoreA(prev => prev + 1);
    } else if (team === 'teamB' && scored) {
      setScoreB(prev => prev + 1);
    }
  };

  // Función para manejar el tiro del usuario
  const handleUserShot = (position: number) => {
    setUserShotOptions(false);
    
    const userScored = penaltyShot(position);
    const teamKey = userTeam as 'teamA' | 'teamB';
    const teamName = teamKey === 'teamA' ? teamA : teamB;

    userShotResultRef.current = userScored;
    
    addMessage(`¡TU TURNO! Pateas a la posición ${position}`);
    addMessage(`${teamName} ${userScored ? "gol" : "erra"}!`); // "River gol!"
    
    // Actualizamos el estado local que reflejará correctamente el resultado
    // pero NO actualizamos el contador total aquí, lo hará el sistema general
    
    // Actualizar tabla de penales únicamente
    // Nota: NO modificamos scoreA o scoreB aquí porque causaría doble conteo
    updatePenaltyResult(teamKey, userScored, currentRound - 1); //TeamA, 6, NRonda -1
    
    // Continuar con la tanda de penales
    setIsUserTurn(false);
    resumeShootout();
  };
  
  const resumeShootout = () => {
    // Esta función se llamará después de que el usuario patea
    continueShootoutRef.current();
  };

  const penaltyShootout = () => {
    // Limpiar mensajes anteriores
    setMessages([]);
    setMatchResult('');
    setIsRunning(true);
    setPenaltyRounds([]);
    setScoreA(0);
    setScoreB(0);
    setCurrentRound(0);
    setIsUserTurn(false);
    setUserShotOptions(false);
    userShotResultRef.current = null;
    
    const rounds = 5;
    let turnoA = 1;
    let turnoB = 1;
    let teamAScore = 0;
    let teamBScore = 0;
    let estado = "A"; // A, B, SuddenA, SuddenB
    let suddenDeathRound = 1;
    
    // Calcular exactamente en qué momento el usuario pateará
    // La ronda del usuario puede ser aleatoria
    let actualUserRound = userRound;
    if (userWillShoot) {
      if (userRound === 'random') {
        actualUserRound = Math.floor(Math.random() * 11) + 1;
        addMessage(`Se ha seleccionado aleatoriamente que patearás en la ronda ${actualUserRound}`);
      } else {
        addMessage(`Patearás en la ronda ${actualUserRound}`);
      }
    }
  
    addMessage(`${teamA} vs ${teamB} - Tanda de penales`);
    
    // Variable para controlar si estamos esperando la acción del usuario
    let waitingForUser = false;
    
    // Función que ejecutará cada paso de la tanda
    const nextStep = () => {
      // Si estamos esperando al usuario, no avanzamos
      if (waitingForUser) {
        return;
      }
      
      // Determinar si es el turno del usuario
      const currentTeamTurn = estado === "A" || estado === "SuddenA" ? "teamA" : "teamB";
      const currentShooterRound = estado === "A" || estado === "SuddenA" ? turnoA : turnoB;
      
      // Calcular el número de tiro global (para cuando hay más de 11 jugadores)
      const globalTurnNumber = currentShooterRound > 11 ? ((currentShooterRound - 1) % 11) + 1 : currentShooterRound;
      
      //setCurrentPenaltyTurn(globalTurnNumber);
      
     const isUserShooting = userWillShoot && currentTeamTurn === userTeam &&
                            Number(actualUserRound) === globalTurnNumber;
      
      if (isUserShooting) {
        // Es el turno del usuario
        setIsUserTurn(true);
        setUserShotOptions(true);
        waitingForUser = true;
        setCurrentRound(currentShooterRound);
        
        // Almacenar el estado actual para continuarlo después del tiro del usuario
        const currentEstado = estado;
        
        addMessage(`¡Es tu turno de patear por ${currentTeamTurn === 'teamA' ? teamA : teamB}!`);
        addMessage(`Selecciona una posición para tu tiro (1-6)`);
        
        // Definir la función que continuará después del tiro del usuario
        continueShootoutRef.current = () => {
          // Actualizar los contadores globales con el resultado del tiro del usuario
          // Esto lo hacemos aquí para que se refleje en la lógica de la tanda
          const userScoredResult = userShotResultRef.current;
          
          if (userScoredResult) {
            if (currentTeamTurn === 'teamA') {
              teamAScore++;
            } else {
              teamBScore++;
            }
          }
          userShotResultRef.current = null;
          waitingForUser = false;
          
          // Continuamos con el flujo normal
          if (currentEstado === "A") {
            estado = "B";
          } else if (currentEstado === "B") {
            turnoA++;
            turnoB++;
            
            if (turnoA > rounds && turnoB > rounds && teamAScore === teamBScore) {
              estado = "SuddenA";
            } else if (turnoA > rounds && turnoB > rounds) {
              const ganador = teamAScore > teamBScore ? teamA : teamB;
              addMessage(`${ganador} gana!`);
              setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
              setIsRunning(false);
              return;
            } else {
              estado = "A";
            }
          } else if (currentEstado === "SuddenA") {
            estado = "SuddenB";
          } else if (currentEstado === "SuddenB") {
            if (teamAScore !== teamBScore) {
              const ganador = teamAScore > teamBScore ? teamA : teamB;
              addMessage(`${ganador} gana!`);
              setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
              setIsRunning(false);
              return;
            } else {
              suddenDeathRound++;
              estado = "SuddenA";
            }
          }
          
          setTimeout(nextStep, interval);
        };
        
        return;
      }
      
      if (estado === "A") {
        // Verificar si el equipo A ya ganó matemáticamente
        if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
          addMessage(`${teamA} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          setIsRunning(false);
          return;
        }
  
        const teamAScored = penaltyShot();
        const restantesA = rounds - turnoA;
        if (teamAScored) teamAScore++;
        
        addMessage(`Ronda ${turnoA}:`);
        addMessage(`${teamA} ${teamAScored ? "gol" : "erra"}! Total: ${teamAScore}. Restantes: ${restantesA}`);
        
        // Actualizar tabla de penales
        updatePenaltyResult('teamA', teamAScored, turnoA - 1);
        setCurrentRound(turnoA);
  
        // Verificar si el equipo A ya ganó matemáticamente
        if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
          addMessage(`${teamA} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          setIsRunning(false);
          return;
        }
  
        // Verificar si el equipo B ya ganó matemáticamente
        if (teamBScore > teamAScore + (rounds - turnoA)) {
          addMessage(`${teamB} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          setIsRunning(false);
          return;
        }

        estado = "B";
      } else if (estado === "B") {
        const teamBScored = penaltyShot();
        const restantesB = rounds - turnoB;
        if (teamBScored) teamBScore++;
        
        addMessage(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}. Restantes: ${restantesB}`);
        
        // Actualizar tabla de penales
        updatePenaltyResult('teamB', teamBScored, turnoB - 1);
  
        // Verificar si el equipo B ya ganó matemáticamente
        if (teamBScore > teamAScore + (rounds - turnoA)) {
          addMessage(`${teamB} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
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
        
        // Actualizar tabla de penales
        updatePenaltyResult('teamA', teamAScored, rounds + suddenDeathRound - 1);
        setCurrentRound(rounds + suddenDeathRound);
  
        estado = "SuddenB";
      } else if (estado === "SuddenB") {
        const teamBScored = penaltyShot();
        if (teamBScored) teamBScore++;
        
        addMessage(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}`);
        
        // Actualizar tabla de penales
        updatePenaltyResult('teamB', teamBScored, rounds + suddenDeathRound - 1);
  
        if (teamAScore !== teamBScore) {
          const ganador = teamAScore > teamBScore ? teamA : teamB;
          addMessage(`${ganador} gana!`);
          setMatchResult(`Resultado final: ${teamA} ${teamAScore} - ${teamBScore} ${teamB}`);
          setIsRunning(false);
          return;
        } else {
          suddenDeathRound++;
          estado = "SuddenA";
        }
      }
      
      // Programar el siguiente paso
      setTimeout(nextStep, interval);
    };
    
    // Iniciar la tanda
    setTimeout(nextStep, interval);
    
    // Guardar la función para continuar después del tiro del usuario
    continueShootoutRef.current = () => {
      waitingForUser = false;
      setTimeout(nextStep, interval);
    };
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInterval(parseInt(e.target.value));
  };

  const handleUserTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserTeam(e.target.value);
  };

  const handleUserWillShootChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserWillShoot(e.target.value === "true");
    setUserWillShoot(e.target.value === 'true');
  };

  const handleUserRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setUserRound(value === 'random' ? 'random' : Number(value));
  };

  // Renderiza el resultado de un penal
  const renderPenaltyResult = (result: boolean | null, isActive: boolean) => {
    if (result === null) {
      return isActive ? <span className="penalty-pending">...</span> : <span className="penalty-empty">-</span>;
    }
    return result ? <span className="penalty-scored">✅</span> : <span className="penalty-missed">❌</span>;
  };

  const volverAInicio = () => {
    navigate("/");
  }

  return (
    <div>
      <button className="backbutton" onClick={volverAInicio}>Volver a Inicio</button>
      <h1>Tanda de Penales</h1>
      <div className="penalties-container">
        <div className="settings">
          <div className="selected-teams">
            <div className="selected-team-card">
              {navigationState?.local?.logo && (
                <img src={navigationState.local.logo} alt={teamA} className="team-logo" />
              )}
              <span className="team-name">{teamA}</span>
            </div>
            <div className="selected-team-card">
              {navigationState?.visitante?.logo && (
                <img src={navigationState.visitante.logo} alt={teamB} className="team-logo" />
              )}
              <span className="team-name">{teamB}</span>
            </div>
          </div>
          
          <div className="interval-select">
            <label>Velocidad de la simulación: </label>
            <select value={interval} onChange={handleIntervalChange} disabled={isRunning}>
              <option value="1000">Muy rápido (1s)</option>
              <option value="2000">Rápido (2s)</option>
              <option value="3000">Normal (3s)</option>
              <option value="5000">Lento (5s)</option>
              <option value="8000">Muy lento (8s)</option>
            </select>
          </div>
          
          {/* Opciones del usuario para participar */}
          <div className="user-settings">
            <div>
              <label>Patear penal </label>
              <select 
                value={userWillShoot.toString()} 
                onChange={handleUserWillShootChange}
                disabled={isRunning}
              >
                <option value="false">No</option>
                <option value="true">Sí</option>
              </select>
            </div> 
            
            {userWillShoot && (
              <>
                <div>
                  <label>Elegir equipo</label>
                  <select 
                    value={userTeam} 
                    onChange={handleUserTeamChange}
                    disabled={isRunning}
                  >
                    <option value="teamA">{teamA}</option>
                    <option value="teamB">{teamB}</option>
                  </select>
                </div>
                
                <div>
                  <label>Elegir ronda</label>
                  <select 
                    value={userRound} 
                    onChange={handleUserRoundChange}
                    disabled={isRunning}
                  >
                    <option value="random">Aleatorio</option>
                    {[...Array(11)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>{index + 1}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
        
        <button 
          className="start-button" 
          onClick={penaltyShootout} 
          disabled={isRunning && !isUserTurn}
        >
          Iniciar tanda
        </button>
        
        {/* Opciones para el tiro del usuario */}
        {userShotOptions && (
          <div className="user-shot-options">
            <h3>¡Tu turno! Elegir dirección del tiro:</h3>
            <div className="goal-grid">
              {[...Array(6)].map((_, index) => (
                <button 
                  key={index + 1} 
                  className="shot-position"
                  onClick={() => handleUserShot(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {(penaltyRounds.length > 0 || isRunning) && (
          <div className="penalties-table-container">
            <table className="penalties-table">
              <thead>
                <tr>
                  <th className="team-name">Equipo</th>
                  {[...Array(Math.max(5, penaltyRounds.length))].map((_, index) => (
                    <th key={index} className={`penalty-round ${currentRound === index + 1 ? 'current-round' : ''}`}>
                      {index + 1}
                    </th>
                  ))}
                  <th className="penalty-total">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="team-name">{teamA}</td>
                  {[...Array(Math.max(5, penaltyRounds.length))].map((_, index) => (
                    <td key={index} className={`penalty-result ${currentRound === index + 1 ? 'current-round' : ''}`}>
                      {renderPenaltyResult(
                        penaltyRounds[index]?.teamA ?? null, 
                        isRunning && currentRound === index + 1 && penaltyRounds[index]?.teamB === undefined
                      )}
                    </td>
                  ))}
                  <td className="penalty-total">{scoreA}</td>
                </tr>
                <tr>
                  <td className="team-name">{teamB}</td>
                  {[...Array(Math.max(5, penaltyRounds.length))].map((_, index) => (
                    <td key={index} className={`penalty-result ${currentRound === index + 1 ? 'current-round' : ''}`}>
                      {renderPenaltyResult(
                        penaltyRounds[index]?.teamB ?? null,
                        isRunning && currentRound === index + 1 && penaltyRounds[index]?.teamA !== undefined && penaltyRounds[index]?.teamB === undefined
                      )}
                    </td>
                  ))}
                  <td className="penalty-total">{scoreB}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {matchResult && (
          <div className="match-result">
            <h2>{matchResult}</h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default Penalties;
