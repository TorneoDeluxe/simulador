const Penalties = () => {
  const positions = 6;
  /*_________
    | 1 2 3 |
    | 4 5 6 |
  */

  const possibilities = 20;
  let onGoal: boolean;
  let scored: boolean;
  
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

  const penaltyShootout = (teamA: string, teamB: string): void => {
    const rounds = 5;
    let turnoA = 1;
    let turnoB = 1;
    let teamAScore = 0;
    let teamBScore = 0;
  
    console.log(`${teamA} vs ${teamB} - Tanda de penales`);
  
    while (turnoA <= rounds && turnoB <= rounds) {
      console.log(`Ronda ${turnoA}:`);
  
      // Verificamos si B está matemáticamente eliminado antes de que A patee
      // Si A ya tiene ventaja insuperable, termina la tanda
      if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
        console.log(`${teamA} gana! ${teamB} no lo puede alcanzar.`);
        break;
      }
  
      // Equipo A patea
      const teamAScored = penaltyShot();
      let restantesA = rounds - turnoA;
      if (teamAScored) teamAScore++;
      console.log(`${teamA} ${teamAScored ? "gol" : "erra"}! Total: ${teamAScore}. Restantes: ${restantesA}`);
      
      // Verificamos si A ganó anticipadamente después de patear
      // Solo si B no puede alcanzar a A, incluso ganando todos sus penales restantes
      if (teamAScore > teamBScore + (rounds - turnoB + 1)) {
        console.log(`${teamA} gana anticipadamente!`);
        break;
      }
      
      // Verificamos si A está matemáticamente eliminado antes de que B patee
      if (teamBScore > teamAScore + (rounds - turnoA)) {
        console.log(`${teamB} gana! ${teamA} no lo puede alcanzar.`);
        break;
      }
      
      // Equipo B patea
      const teamBScored = penaltyShot();
      let restantesB = rounds - turnoB;
      if (teamBScored) teamBScore++;
      console.log(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}. Restantes: ${restantesB}`);
      
      // Verificamos si B ganó anticipadamente después de patear
      if (teamBScore > teamAScore + (rounds - turnoA)) {
        console.log(`${teamB} gana anticipadamente!`);
        break;
      }
      
      turnoA++;
      turnoB++;
    }
  
    // Si todavía hay empate después de los 5 penales, vamos a muerte súbita
    if (teamAScore === teamBScore) {
      let suddenDeathRound = 1;
      
      while (teamAScore === teamBScore) {
        console.log(`Ronda ${suddenDeathRound+5} - Muerte súbita ${suddenDeathRound}:`);
        
        // Equipo A patea
        const teamAScored = penaltyShot();
        if (teamAScored) teamAScore++;
        console.log(`${teamA} ${teamAScored ? "gol" : "erra"}! Total: ${teamAScore}`);
        
        // Equipo B patea
        const teamBScored = penaltyShot();
        if (teamBScored) teamBScore++;
        console.log(`${teamB} ${teamBScored ? "gol" : "erra"}! Total: ${teamBScore}`);
        
        suddenDeathRound++;
      }
    }
  
    console.log(`Resultado final: ${teamA} ${teamAScore} - ${teamB} ${teamBScore}`);
  
    if (teamAScore > teamBScore) {
      console.log(`${teamA} gana la serie!`);
    } else {
      console.log(`${teamB} gana la serie!`);
    }
  };
  
  penaltyShootout("Team A", "Team B");

  return <div>
    <h1>
    Penales</h1>
    </div>
}

export default Penalties;
