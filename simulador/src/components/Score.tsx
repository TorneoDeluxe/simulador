import { useEffect, useState, useRef } from "react";

interface Chance {
    result: string;
    team: string;
    minute?: number;
    half?: string;
}

const Score = () => {

    const teams = [
        { name: "Real Madrid", logo: "team1logo.png", chances: 11, media: 90 },
        { name: "Sevilla", logo: "team2logo.png", chances: 8, media: 82 },
        { name: "Barcelona", logo: "team3logo.png", chances: 5, media: 87 },
        { name: "Atlético Madrid", logo: "team4logo.png", chances: 2, media: 85 },
    ];

    const handleTeam1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTeam = teams.find(team => team.name === event.target.value);
        if (selectedTeam) {
            setTeam1(selectedTeam);
        }
    };

    const handleTeam2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTeam = teams.find(team => team.name === event.target.value);
        if (selectedTeam) {
            setTeam2(selectedTeam);
        }
    };

    const gameTime: number = 45;

    const [currentMinute, setCurrentMinute] = useState<string | number>(1);
    const [matchDuration, setMatchDuration] = useState<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
    const [goalsTeam1, setGoalsTeam1] = useState(0);
    const [goalsTeam2, setGoalsTeam2] = useState(0);
    const [team1, setTeam1] = useState({ name: "Real Madrid", logo: "team1logo.png", chances: 11, media: 90 });
    const [team2, setTeam2] = useState({ name: "Sevilla", logo: "team2logo.png", chances: 8, media: 82 });
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
    
    const playMatch = () => {
        const minutesPlayed = simulateMinutes();
        const simmedChances = assignMinutes(minutesPlayed);
        defineMatchDuration(minutesPlayed, simmedChances);
        setIsGameStarted(true);
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

    const estimateChances = (chances: number, chancesDifferential: number) => {
        return Math.floor(Math.random() * (2 * chancesDifferential + 1)) + (chances - chancesDifferential);
    };

    const simulateChances = (team1: any, team2: any) => {
        const team1Name = team1.name;
        const team2Name = team2.name;
        //Reemplazar esto con el cálculo de chances según la media.
        //La constante de abajo tiene que ser (estimatedChances(cálculo, diferencial))
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
                clearInterval(interval);
                scoreText = 'Final del partido';
                setCurrentMinute(scoreText);
                setIsGameFinished(true);
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
                writeChance(chance);
    
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

    const writeChance = (chance: Chance) => {
        setDisplayedChances((prevChances) => [...prevChances, chance]);
    }

    const resetGame = () => {
        window.location.reload();
    };

    function calculateChances(media1: any, media2: any, avgChances: any) {
        const lowerMedia = Math.min(media1, media2);
        const mediaDifference = Math.abs(media1 - media2);
        let disparity;
        let base1, base2;
    
        if (lowerMedia >= 77) {
            disparity = 1.05;
        } else if (lowerMedia >= 70) {
            disparity = 1.1;
        } else if (lowerMedia >= 66) {
            disparity = 1.2;
        } else if (lowerMedia >= 59) {
            disparity = 1.5;
        } else if (lowerMedia >= 53) {
            disparity = 1.8;
        } else {
            disparity = 2.5;
        }
    
        // Calcular incremento por diferencia de media
        const alpha = (mediaDifference / 13) * disparity;
        //El 13 es un número mágico para calcular mediante la disparidad, para hallar una base relativamente precisa.
    
        const delta = Math.floor(Math.random() * 2) + 1;
        //Delta devuelve un valor que es 1 o 2 para que las chances oscilen en ese rango. Si la base es 12 y delta = 2, las chances
        // estarán entre 10 y 14.
        let baseHigh = avgChances / 2 + alpha * delta;
        let baseLow = avgChances / 2 - alpha * delta;
    
        if (media1 >= media2) {
            base1 = baseHigh;
            base2 = baseLow;
        } else {
            base1 = baseLow;
            base2 = baseHigh;
        }
    
        const range1 = base1 < 0 ? [0, 1] : [Math.max(0, Math.ceil(base1 - delta)), Math.ceil(base1 + delta)];
    
        const range2 = base2 < 0 ? [0, 1] : [Math.max(0, Math.ceil(base2 - delta)), Math.ceil(base2 + delta)];
    
        return {
            media1,
            media2,
            avgChances,
            disparity,
            alpha,
            base1: base1.toFixed(2),
            base2: base2.toFixed(2),
            range1,
            range2,
        };
    }
    
    let avgChances = 20;
    const matches = [
        { media1: 90, media2: 87 },
        { media1: 90, media2: 81 },
        { media1: 90, media2: 75 },
        { media1: 90, media2: 40 },
        { media1: 80, media2: 60 },
        { media1: 60, media2: 50 },
        { media1: 90, media2: 25 },
        { media1: 74, media2: 70 },
    ];
    
    matches.forEach(match => {
        const result = calculateChances(match.media1, match.media2, avgChances);
        console.log(match.media1 + " vs " + match.media2);
        console.log(result);
    });

    return (
        <div>
            <div>
                <label htmlFor="match-duration">Duración del partido:</label>
                <select id="match-duration" onChange={handleMatchDurationChange} disabled={isGameStarted}>
                    <option value="">Seleccionar:</option>
                    <option value="0.0017">1 segundo</option>
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
{/*                 <label htmlFor="match-duration">Chances especiales:</label>
                <input type="number"></input> */}

            </div>

            <div style={{marginTop: "20px"}}>
                <h4>{team1.name} vs {team2.name} </h4>
            </div>

            <div>
                <label htmlFor="team1-select">Seleccionar Equipo 1: </label>
                <select id="team1-select" value={team1.name} onChange={handleTeam1Change} disabled={isGameStarted}>
                {teams.map((team) => (
                    <option key={team.name} value={team.name}>
                    {team.name}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label htmlFor="team2-select">Seleccionar Equipo 2: </label>
                <select id="team2-select" value={team2.name} onChange={handleTeam2Change} disabled={isGameStarted}>
                {teams.map((team) => (
                    <option key={team.name} value={team.name}>
                    {team.name}
                    </option>
                ))}
                </select>
            </div>

            <h5>{currentMinute}</h5>
            <h2>{goalsTeam1} - {goalsTeam2}</h2>
            {simulateMinutes() && <p>Total tiempo de juego: {simulateMinutes().length} minutos</p>}

            <button onClick={playMatch} disabled={isGameStarted || matchDuration === null}>
                Jugar
            </button>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", width: "30%" }}>
                <div style={{ width: "60%", textAlign: "center" }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {displayedChances.map((chance, index) => (
                            <li
                                key={index}
                                style={{
                                    display: "flex",
                                    justifyContent: chance.team === team1.name ? "flex-start" : "flex-end",
                                    marginBottom: "5px",
                                }}
                            >
                                <span
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "#f1f1f1",
                                        borderRadius: "5px",
                                        textAlign: chance.team === team2.name ? "left" : "right",
                                        maxWidth: "70%",
                                        wordWrap: "break-word",
                                    }}
                                >
                                    {chance.team === team1.name ? chance.result === "Gol" ? `${chance.minute}' 🟢 Gol`
                                            : `${chance.minute}' ❌ Errado`
                                        : chance.result === "Gol"
                                        ? `Gol 🟢 ${chance.minute}'`
                                        : `Errado ❌ ${chance.minute}'`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {isGameFinished && (
                <button onClick={resetGame}>Reiniciar</button>
            )}
        </div>
    );
};

export default Score;

//Ideas para definir la media de países:
//Países: ARG, ESP, FRA: 85. ALE, ING, BRA: 84
// Para el resto de selecciones, proporcional según puntos de ranking FIFA.
//Si una selección tiene el 70% de puntos de Argentina, entonces su media será el 70% de 85.
//Medias de clubes: a calcular. Sobre todo clubes del ascenso argentino y de Islandia. Para el resto
// puedo usar las medias del FC25. Apoyarme en lo hecho anteriormente en los clubes del Modo Carrera.