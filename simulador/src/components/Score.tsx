import { useEffect, useState, useRef } from "react";

interface Chance {
    result: string;
    team: string;
    minute?: number;
    half?: string;
}

const Score = () => {
    let team1 = { name: "Real Madrid", logo: "team1logo.png", chances: 11 }; // Simulación de datos del equipo
    let team2 = { name: "Sevilla", logo: "team2logo.png", chances: 8 };

    const gameTime: number = 45;

    let goalsTeam1 = 0;
    let goalsTeam2 = 0;

    const getExtraTime = (): number => Math.floor(Math.random() * (4 - 1 + 1)) + 1;

    const [currentMinute, setCurrentMinute] = useState<string | number>(1);
    const [totalGameTime, setTotalGameTime] = useState<number | null>(null);
    const [matchDuration, setMatchDuration] = useState<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

    const [chancesTeam1, setChancesTeam1] = useState<any[]>([]);
    const [chancesTeam2, setChancesTeam2] = useState<any[]>([]);
    const [displayedChances, setDisplayedChances] = useState<any[]>([]);

    const intervalIdRef = useRef<number | null>(null);

    // Función para generar minutos únicos para las chances
    const generateUniqueMinutes = (totalMinutes: number, chances: number): number[] => {
        const minutes = new Set<number>();
        while (minutes.size < chances) {
            const minute = Math.floor(Math.random() * totalMinutes) + 1;
            minutes.add(minute);
        }
        return Array.from(minutes).sort((a, b) => a - b);
    };

    const generateChances = (teamName: string, chances: number, gameTime: number = 90) => {
        // Simular resultados de las chances
        const simulatedChances = Array.from({ length: chances }, () => ({
            result: Math.floor(Math.random() * 6) + 1 === 1 ? "Gol" : "Errado",
            team: teamName,
        }));
    
        // Asignar minutos únicos
        const uniqueMinutes = generateUniqueMinutes(gameTime * 2, chances);
        return simulatedChances.map((chance, index) => ({
            ...chance,
            minute: uniqueMinutes[index],
        }));
    };

    const simulateHalf = (timeLimit: number, offset: number, endMessage: string, callback?: () => void) => {
        let simulatedMinutes = 1;
        const intervalDuration = ((matchDuration ?? 0) * 60 * 1000) / 90;

        intervalIdRef.current = window.setInterval(() => {
            if (simulatedMinutes <= gameTime) {
                setCurrentMinute(simulatedMinutes + offset);

                // Mostrar chances según el minuto actual
                const newChances = [
                    ...chancesTeam1.filter((chance) => chance.minute === simulatedMinutes + offset),
                    ...chancesTeam2.filter((chance) => chance.minute === simulatedMinutes + offset),
                ];
                console.log(newChances);
                setDisplayedChances((prev) => [...prev, ...newChances]);

                // Actualizar marcador
                newChances.forEach((chance) => {
                    if (chance.result === "Gol") {
                        if (chance.team === team1.name) goalsTeam1++;
                        if (chance.team === team2.name) goalsTeam2++;
                    }
                });
            } else {
                setCurrentMinute(`${gameTime + offset}+`);
            }

            simulatedMinutes++;

            if (simulatedMinutes > timeLimit) {
                if (intervalIdRef.current) clearInterval(intervalIdRef.current);
                setCurrentMinute(endMessage);
                if (callback) callback();
            }
        }, intervalDuration);
    };

    //Creo que lo mejor es simular el tiempo de juego total (ya está listo) y
    // luego simular las chances de ambos (listo en generateChances).
    //Tomar las chances, y asignarles un minuto al azar. Esto después de que se sepa cuántos minutos tendrá el partido.
    //Cuando el minuto del marcador coincida con el del gol, subir el gol al marcador. Luego extender esto
    // a las chances erradas en el tablero.
    //Si el PT dura 47 minutos y el partido dura 95, un gol en el minuto "60" habrá sido en el minuto 63 jugado, aunque
    // en pantalla se muestre como minuto 60. Será algo como if segundo tiempo: minutos + offset - duración PT (revisar).
    /* {
        minute: 1, shoot: "Gol", half: first, minuteScreen: 1
        minute: 47, shoot: "Gol", half: first, minuteScreen: 45+2
        minute: 46, shoot: "Gol", half: second, minuteScreen: 46
    } */
   //Una función que sea
   /*
    advanceTime(minutes, chances1, chances2){
        if minuto === chances1.minuto || minuto === chances2.minuto{
            si es gol, sumarlo al marcador e imprimir chance
            else, imprimir chance
        }
            minuto++;
    }
    Y quizás llamar la función de manera que sea
    while minuto < total partido{
    advanceTime(tiempoDeJuego, RealMadrid, Sevilla)
    }
   */

    const simulateTime = () => {
        const firstHalfExtraTime = getExtraTime();
        const secondHalfExtraTime = getExtraTime();
        const calculatedTotalGameTime = gameTime * 2 + firstHalfExtraTime + secondHalfExtraTime;
        setTotalGameTime(calculatedTotalGameTime);

        if (matchDuration === -1) {
            setMatchDuration(calculatedTotalGameTime / 60);
        }
    };

    const handleMatchDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "full") {
            setMatchDuration(-1);
        } else {
            setMatchDuration(Number(value));
        }
    };

    const handleStartGame = () => {
        setIsGameStarted(true);
        simulateTime();
    };

    useEffect(() => {
        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, []);

    
    const playMatch = () => {
        simulateMinutes();
        simulateChances(team1, team2);
        assignMinutes();
        // defineMatchDuration();
        // advanceTime(); Acá avanzo el tiempo en pantalla, y si es gol lo subo al marcador
        // writeChances(); Acá escribo abajo las chances de gol de cada equipo.
    }

    const simulateMinutes = () => {
        const getExtraTime = (): number => Math.floor(Math.random() * (4 - 1 + 1)) + 1;
        const firstHalfExtraTime = getExtraTime();
        const minutesFirstHalf = []
        for (let i = 0; i < gameTime + firstHalfExtraTime; i++){
            minutesFirstHalf.push({number: i + 1, half: 'first'});
        }

        const secondHalfExtraTime = getExtraTime();
        const minutesSecondHalf = []
        for (let i = 0; i < gameTime + secondHalfExtraTime; i++){
            minutesSecondHalf.push({number: i + 46, half: 'second'});
        }

        const totalGameTime = minutesFirstHalf.concat(minutesSecondHalf);
        return totalGameTime;
    }

    const simulateChances = (team1: any, team2: any) => {
        const team1Name = team1.name;
        const team2Name = team2.name;
        const team1Chances = team1.chances;
        const team2Chances = team2.chances;

        let team1Shots = [];
        let team2Shots = [];
        let goals1 = 0;
        let goals2 = 0;
        let result = '';

        for(let i= 0; i < team1Chances; i++){
            let shot: number = Math.floor(Math.random() * 6) + 1;
            if (shot === 1){
                result = 'Gol';
                goals1++;
            } else {
                result = 'Errado';
            }
            team1Shots.push({result: result, team: team1Name});
        }

        for(let i= 0; i < team2Chances; i++){
            let shot: number = Math.floor(Math.random() * 6) + 1;
            if (shot === 1){
                result = 'Gol';
                goals2++;
            } else {
                result = 'Errado';
            }
            team2Shots.push({result: result, team: team2Name});
        }
        
        const totalChances = team1Shots.concat(team2Shots);
        return totalChances;
    }

    const assignMinutes = () => {
        const minutesPlayed = simulateMinutes();
        const chancesPlayed: Chance[] = simulateChances(team1, team2);
    
        const assignedMinutes = new Set<string>();
    
        const getRandomMinute = (): { number: number, half: string } => {
            const randomIndex = Math.floor(Math.random() * minutesPlayed.length);
            return minutesPlayed[randomIndex];
        };
    
        for (let i = 0; i < chancesPlayed.length; i++) {
            let minute;
            let half;
            // Asegurarse de que el minuto y la mitad no estén asignados
            do {
                const randomMinute = getRandomMinute();
                minute = randomMinute.number;
                half = randomMinute.half;
    
                var key = `${minute}-${half}`;
            } while (assignedMinutes.has(key));
    
            assignedMinutes.add(key);

            chancesPlayed[i].minute = minute;
            chancesPlayed[i].half = half;
        }
    
        // Ordenar las chances por minuto y mitad
        chancesPlayed.sort((a, b) => {
            if (a.half === b.half) {
                return a.minute! - b.minute!;
            }
            return a.half === "first" ? -1 : 1;
        });
        console.log(chancesPlayed);
        return chancesPlayed;
    };

    return (
        <div>
            <h5>{currentMinute}</h5>
            <h2>{goalsTeam1} - {goalsTeam2}</h2>
            {totalGameTime !== null && <p>Total tiempo de juego: {totalGameTime} minutos</p>}

            <div>
                <label htmlFor="match-duration">Duración del partido:</label>
                <select id="match-duration" onChange={handleMatchDurationChange} disabled={isGameStarted}>
                    <option value="">Seleccionar:</option>
                    <option value="0.05">3 segundos</option>
                    <option value="0.25">15 segundos</option>
                    <option value="0.5">30 segundos</option>
                    <option value="1">1 minuto</option>
                    <option value="2">2 minutos</option>
                    <option value="5">5 minutos</option>
                    <option value="10">10 minutos</option>
                    <option value="15">15 minutos</option>
                    <option value="20">20 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">60 minutos</option>
                    <option value="full">Partido completo</option>
                </select>
            </div>

            <button onClick={handleStartGame} disabled={isGameStarted || matchDuration === null}>
                Jugar
            </button>

            <button onClick={playMatch} disabled={isGameStarted || matchDuration === null}>
                Jugar2
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                <div>
                    <h4>{team1.name}</h4>
                    {displayedChances
                        .filter((chance) => chance.team === team1.name)
                        .map((chance, index) => (
                            <p key={index}>
                                Min {chance.minute}: {chance.result === "Gol" ? "🟢 Gol" : "❌ Errado"}
                            </p>
                        ))}
                </div>
                <div>
                    <h4>{team2.name}</h4>
                    {displayedChances
                        .filter((chance) => chance.team === team2.name)
                        .map((chance, index) => (
                            <p key={index}>
                                Min {chance.minute}: {chance.result === "Gol" ? "🟢 Gol" : "❌ Errado"}
                            </p>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Score;
