import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Score.css";

interface Chance {
    result: string;
    team: string;
    minute?: number;
    half?: string;
    isSpecial?: boolean
}

interface Team {
    name: string;
    logo: string;
    media: number;
  }

interface LocationState {
    local: Team;
    visitante: Team;
  }

const Score = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const volverAPartido = () => {
        navigate("/partido", {
            state: { local, visitante },
        });
    };
    const { local, visitante } = location.state as LocationState;

    const generateLogoPath = (name: string) => {
        const basePath = "/src/assets/Escudos";
        return `${basePath}/${name.replace(/\s+/g, "_").replace(/[()]/g, "")}.png`;
    };
    local.logo = generateLogoPath(local.name);
    visitante.logo = generateLogoPath(visitante.name);

    const gameTime: number = 45;

    const [currentMinute, setCurrentMinute] = useState<string | number>(0);
    const [matchDuration, setMatchDuration] = useState<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
    const [specialChancesTeam1, setSpecialChancesTeam1] = useState(0);
    const [specialChancesTeam2, setSpecialChancesTeam2] = useState(0);
    const [goalsTeam1, setGoalsTeam1] = useState(0);
    const [goalsTeam2, setGoalsTeam2] = useState(0);
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

    function simulateChances(team1: any, team2: any, specialChancesTeam1: number, specialChancesTeam2: number) {
        const team1Name = team1.name;
        const team2Name = team2.name;
    
        const chancesData = calculateChancesFromMedia(team1.media, team2.media);
        console.log(chancesData);
    
        const team1Chances = chancesData.chances1 + specialChancesTeam1;
        const team2Chances = chancesData.chances2 + specialChancesTeam2;
    
        console.log(team1Name + ": " + chancesData.chances1 + " chances.");
        console.log(team2Name + ": " + chancesData.chances2 + " chances.");
    
        let team1Shots: any = [];
        let team2Shots: any = [];
        let goals1 = 0;
        let goals2 = 0;
        let result = '';
    
        for (let i = 0; i < team1Chances; i++) {
            const isSpecial = i >= team1Chances - specialChancesTeam1;
            let shot: number;
            if (isSpecial) {
                shot = Math.floor(Math.random() * 3) + 1;
            } else {
                shot = Math.floor(Math.random() * 6) + 1;
            }
            if (shot === 1) {
                result = 'Gol';
                goals1++;
            } else {
                result = 'Errado';
            }
            team1Shots.push({ result, team: team1Name, isSpecial });
        }
    
        for (let i = 0; i < team2Chances; i++) {
            const isSpecial = i >= team2Chances - specialChancesTeam2;
            let shot: number;
            if (isSpecial) {
                shot = Math.floor(Math.random() * 3) + 1;
            } else {
                shot = Math.floor(Math.random() * 6) + 1;
            }
            if (shot === 1) {
                result = 'Gol';
                goals2++;
            } else {
                result = 'Errado';
            }
            team2Shots.push({ result, team: team2Name, isSpecial });
        }
    
        const totalChances = team1Shots.concat(team2Shots);
        return totalChances;
    }
    
    const assignMinutes = (minutesPlayed: { number: number; half: string }[]) => {
        const chancesPlayed: Chance[] = simulateChances(local, visitante, specialChancesTeam1, specialChancesTeam2);
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
                    if (chance.team === local.name) {
                        setGoalsTeam1((prevGoals) => prevGoals + 1);
                    } else if (chance.team === visitante.name) {
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

    const goToPenalties = () => {
        navigate("/penales/simulacion", {
            state: { local, visitante },
        });
    };

    function randomBetween(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function getTotalChances(mediaDifference: number, lowerMedia: number): number {
        let minChances = 10;
        let maxChances = 16;
    
        if (mediaDifference < 5) {
            minChances = 10;
            maxChances = 16;
        } else if (mediaDifference < 10) {
            minChances = 14;
            maxChances = 20;
        } else if (mediaDifference < 20) {
            minChances = 18;
            maxChances = 26;
        } else {
            minChances = 22;
            maxChances = 30;
        }
    
        if (lowerMedia <= 50) {
            maxChances += 10;
        } else if (lowerMedia <= 65) {
            maxChances += 6;
        }
    
        return randomBetween(minChances, maxChances);
    }
    
    function calculateChancesFromMedia(media1: number, media2: number) {
        const mediaDifference = Math.abs(media1 - media2);
        const lowerMedia = Math.min(media1, media2);
        const totalChances = getTotalChances(mediaDifference, lowerMedia);
    
        let scalingFactor = 60;
    
        if (lowerMedia <= 50) scalingFactor = 30;
        else if (lowerMedia <= 65) scalingFactor = 45;
        else if (lowerMedia > 85) scalingFactor = 80;
    
        let rawAdvantage = Math.min(mediaDifference, 30) / scalingFactor;
    
        // 🎲 Aleatoriedad proporcional a la diferencia
        const randomnessRange = Math.max(0.01, 0.05 - mediaDifference * 0.0015);
        const randomness = (Math.random() - 0.5) * 2 * randomnessRange;
        rawAdvantage = Math.max(0, Math.min(0.5, rawAdvantage + randomness));
    
        const advantageRatio = media1 === media2
            ? 0.5
            : media1 > media2
                ? 0.5 + rawAdvantage
                : 0.5 - rawAdvantage;
    
        const chances1 = Math.round(totalChances * advantageRatio);
        const chances2 = totalChances - chances1;
    
        return {
            media1,
            media2,
            totalChances,
            chances1,
            chances2
        };
    }
  
    return (
        <div>
            <button className="backbutton" onClick={volverAPartido}>Volver</button>
            <div className="intro-clubes">
                <div className="team-intro">
                    <h4>Local</h4>
                    <img className="escudo-grande" src={local.logo} alt={local.name} />
                    <h2> {local.name} </h2>
                    <p>Media: {local.media}</p>
                </div>
                <div className="data">
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
                        <option value="93">Partido completo</option>
                    </select>
                    <div className="info">
                        <p className="timer">{currentMinute}</p>
                        <p className="result">{goalsTeam1} - {goalsTeam2}</p>
                    </div>
                    {!isGameFinished ? (
                        <button
                            className="btn-jugar" onClick={playMatch}
                            disabled={isGameStarted || matchDuration === null}
                        >Jugar</button>
                    ) : (
                        <div className="post-match-actions">
                            <button className="btn-jugar" onClick={resetGame}>Reiniciar</button>
                            {goalsTeam1 === goalsTeam2 && (
                                <button className="btn-jugar" onClick={goToPenalties}>Ir a penales</button>
                            )}
                        </div>
                    )}
                </div>
                <div className="team-intro">
                    <h4>Visitante</h4>
                    <img className="escudo-grande" src={visitante.logo} alt={visitante.name} />
                    <h2> {visitante.name} </h2>
                    <p>Media: {visitante.media}</p>
                </div>
            </div>

            <div className="special-chances">
                <label>
                    Chances especiales equipo 1:
                    <input className="special-chances-input"
                        type="number"
                        min="0"
                        max="25"
                        value={specialChancesTeam1}
                        onChange={(e) => setSpecialChancesTeam1(parseInt(e.target.value) || 0)}
                    />
                </label>
            </div>

            <div className="special-chances">
                <label>
                    Chances especiales equipo 2:
                    <input className="special-chances-input"
                        type="number"
                        min="0"
                        max="25"
                        value={specialChancesTeam2}
                        onChange={(e) => setSpecialChancesTeam2(parseInt(e.target.value) || 0)}
                    />
                </label>
            </div>

            <div className="score-container">
                {/* <div className="escuditos">
                    <img src={local.logo} alt={local.name} />
                    <img src={visitante.logo} alt={visitante.name} />
                </div> */}
                <div className="score-inner">
                    <ul className="score-list">
                        {displayedChances.map((chance, index) => (
                            <li
                                key={index}
                                className={`score-item ${chance.team === local.name ? 'left' : 'right'}`}
                            >
                                <span
                                    className={`score-text ${chance.isSpecial ? 'special' : ''} ${chance.team === visitante.name ? 'align-left' : 'align-right'}`}
                                >
                                    {chance.team === local.name
                                        ? chance.result === "Gol"
                                            ? `${chance.minute}' 🟢 ¡Gol!`
                                            : `${chance.minute}' ❌ Errado`
                                        : chance.result === "Gol"
                                        ? `¡Gol! 🟢 ${chance.minute}'`
                                        : `Errado ❌ ${chance.minute}'`}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
        </div>
    );
};

export default Score;
