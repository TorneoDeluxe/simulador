const Penalties = () => {
    const positions = 6;
    const possibilities = 10;
    let onGoal: boolean;
    let scored: boolean;
    
    const shoot = (): number => {
      return Math.floor(Math.random() * positions) + 1;
    };
    
    const shootOnGoal = (): boolean => {
      const result = Math.floor(Math.random() * possibilities) + 1;
      if (result <= 8) {
        onGoal = true;
      } else {
        onGoal = false;
      }
      return onGoal;
    };
    
    const dive = (): number => {
      const divePosition = Math.floor(Math.random() * positions) + 1;
      // Treat positions 2 and 5 as equivalent
      return divePosition === 2 ? 5 : divePosition;
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
          scored = saveChance > 9 ? true : false;
        }
        else {
          scored = true;
        }

      } else {
        // Tiro a la posición 5
        const goalkeeperPosition = dive();
        if (goalkeeperPosition === 5) {
          const saveChance = Math.floor(Math.random() * possibilities) + 1;
          scored = saveChance > 9 ? true : false;
        } else {
          scored = true;
        }
      }

      return scored;
    };

    const penaltyShootout = (teamA: string, teamB: string, rounds: number = 5): void => {
        let teamAScore = 0;
        let teamBScore = 0;
        let i = 1;
      
        console.log(`${teamA} vs ${teamB} - Penalty Shootout Start`);
      
        while (i <= rounds) {
          console.log(`Round ${i}:`);
      
          const teamAScored = penaltyShot();
          if (teamAScored) teamAScore++;
          console.log(`${teamA} ${teamAScored ? "scores" : "misses"}! Total: ${teamAScore}`);
      
          if (teamAScore > teamBScore + (rounds - i)) {
            console.log(`${teamA} wins early!`);
            return;
          }
      
          const teamBScored = penaltyShot();
          if (teamBScored) teamBScore++;
          console.log(`${teamB} ${teamBScored ? "scores" : "misses"}! Total: ${teamBScore}`);
      
          if (teamBScore > teamAScore + (rounds - i)) {
            console.log(`${teamB} wins early!`);
            return;
          }
      
          i++;
        }
      
        while (teamAScore === teamBScore) {
          console.log(`Sudden Death Round ${i}:`);
      
          const teamAScored = penaltyShot();
          if (teamAScored) teamAScore++;
          console.log(`${teamA} ${teamAScored ? "scores" : "misses"}! Total: ${teamAScore}`);
      
          const teamBScored = penaltyShot();
          if (teamBScored) teamBScore++;
          console.log(`${teamB} ${teamBScored ? "scores" : "misses"}! Total: ${teamBScore}`);
      
          if (teamAScore !== teamBScore) break;
      
          i++;
        }
      
        console.log(`Final Score: ${teamA} ${teamAScore} - ${teamB} ${teamBScore}`);
      
        if (teamAScore > teamBScore) {
          console.log(`${teamA} wins the shootout!`);
        } else {
          console.log(`${teamB} wins the shootout!`);
        }
      };
      
      penaltyShootout("Team A", "Team B");
}

export default Penalties;
