import { useEffect, useState, useRef } from "react";

interface Chance {
    result: string;
    team: string;
    minute?: number;
    half?: string;
}

const Score = () => {
    let team1 = { name: "Real Madrid", logo: "team1logo.png", chances: 41 }; // Simulación de datos del equipo
    let team2 = { name: "Sevilla", logo: "team2logo.png", chances: 48 };

    const gameTime: number = 45;

    const [currentMinute, setCurrentMinute] = useState<string | number>(1);
    const [totalGameTime, setTotalGameTime] = useState<number | null>(null);
    const [matchDuration, setMatchDuration] = useState<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [goalsTeam1, setGoalsTeam1] = useState(0);
    const [goalsTeam2, setGoalsTeam2] = useState(0);

    const [chancesTeam1, setChancesTeam1] = useState<any[]>([]);
    const [chancesTeam2, setChancesTeam2] = useState<any[]>([]);
    const [displayedChances, setDisplayedChances] = useState<any[]>([]);

    const intervalIdRef = useRef<number | null>(null);

    const handleMatchDurationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "full") {
            setMatchDuration(-1);
        } else {
            setMatchDuration(Number(value));
        }
    };

    useEffect(() => {
        return () => {
            if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        };
    }, []);
    //---------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------
    
    const playMatch = () => {
        const minutesPlayed = simulateMinutes();
        const simmedChances = assignMinutes(minutesPlayed);
        defineMatchDuration(minutesPlayed, simmedChances);
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

    const assignMinutes = (minutesPlayed: { number: number; half: string }[]) => {
        const chancesPlayed: Chance[] = simulateChances(team1, team2);
        console.log(chancesPlayed);
        const assignedMinutes = new Set<string>();
    
        const getRandomMinute = (): { number: number, half: string } => {
            const randomIndex = Math.floor(Math.random() * minutesPlayed.length);
            return minutesPlayed[randomIndex];
        };

        for (let i = 0; i < chancesPlayed.length; i++) {
            let minute;
            let half;
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
        return chancesPlayed;
    };

    const defineMatchDuration = (minutesPlayed: { number: number; half: string }[], simmedChances: Chance[]) => {
        if (matchDuration === null || matchDuration === 0) {
            console.error("La duración del partido no está definida o no es válida.");
            return;
        }
    
        const totalMinutes = minutesPlayed.length;

        let intervalDuration: number;
        if (matchDuration === -1) {
            intervalDuration = 1000;
        } else {
            intervalDuration = (matchDuration * 60 * 1000) / totalMinutes;
        }
        advanceTime(minutesPlayed, intervalDuration, simmedChances);
    }
    
    const advanceTime = (minutesPlayed: { number: number; half: string }[],
        intervalDuration: number,
        simmedChances: Chance[]) => {
        let currentMinuteIndex = 0;
        let scoreText = "";

        const interval = setInterval(() => {
            if (currentMinuteIndex >= minutesPlayed.length) {
                if (currentMinuteIndex === minutesPlayed.length) {
                    console.log("Último minuto simulado:", minutesPlayed[minutesPlayed.length - 1]);
                }
                clearInterval(interval);
                scoreText = 'Final del partido';
                setCurrentMinute(scoreText);
                return;
            }
    
            const currentMinute = minutesPlayed[currentMinuteIndex];
            if(currentMinute.number > 45 && currentMinute.half == 'first'){
                scoreText = `45'+${currentMinute.number-45}`;
            }
            else if(currentMinute.number > 90){
                scoreText = `90'+${currentMinute.number-90}`
            }
            else {
                scoreText = `${currentMinute.number}'`;
            }

            const chancesThisMinute = simmedChances.filter(chance => 
                chance.minute === currentMinute.number && chance.half === currentMinute.half
            );
    
            chancesThisMinute.forEach((chance) => {
                console.log(`${chance.minute} minutos: ${chance.result} de ${chance.team}.`);
    
                if (chance.result === "Gol") {
                    if (chance.team === team1.name) {
                        setGoalsTeam1((prevGoals) => prevGoals + 1);
                    } else if (chance.team === team2.name) {
                        setGoalsTeam2((prevGoals) => prevGoals + 1);
                    } else {
                        console.error("Hay un error.");
                    }
                }
            });

            setCurrentMinute(scoreText);

            currentMinuteIndex++;
        }, intervalDuration);
    }

    return (
        <div>
            <div>
                <label htmlFor="match-duration">Duración del partido:</label>
                <select id="match-duration" onChange={handleMatchDurationChange} disabled={isGameStarted}>
                    <option value="">Seleccionar:</option>
                    <option value="0.0016">1 segundo</option>
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

            <h5>{currentMinute}</h5>
            <h2>{goalsTeam1} - {goalsTeam2}</h2>
            {totalGameTime !== null && <p>Total tiempo de juego: {simulateMinutes().length} minutos</p>}

            <button onClick={playMatch} disabled={isGameStarted || matchDuration === null}>
                Jugar
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