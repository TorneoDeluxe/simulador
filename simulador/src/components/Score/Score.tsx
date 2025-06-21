import { useEffect, useState, useRef } from "react";
import "./Score.css";

interface Chance {
    result: string;
    team: string;
    minute?: number;
    half?: string;
    isSpecial?: boolean
}

const Score = () => {
    const teams = [

        //    MdC
        { name: "Barcelona", media: 88, logo: "" },
        { name: "Liverpool", media: 87, logo: "" },
        { name: "Bayern Munich", media: 90, logo: "" },
        { name: "Juventus", media: 83, logo: "" },
        { name: "Paris Saint-Germain", media: 87, logo: "" },
        //{ name: "Real Madrid", media: 90, logo: "" },
        { name: "Manchester City", media: 92, logo: "" },
        { name: "Benfica", media: 81, logo: "" },
        { name: "River Plate", media: 82, logo: "" },
        { name: "Flamengo", media: 83, logo: "" },
        { name: "Estudiantes LP", media: 77, logo: "" },
        { name: "Sao Paulo", media: 76, logo: "" },
        { name: "San Lorenzo", media: 78, logo: "" },
        { name: "Atlético Nacional", media: 75, logo: "" },
        { name: "Deportivo Cali", media: 71, logo: "" },
        { name: "Inter Miami", media: 80, logo: "" },
        { name: "América", media: 75, logo: "" },
        { name: "Pachuca", media: 73, logo: "" },
        { name: "CF Montreal", media: 72, logo: "" },
        { name: "Seattle Sounders", media: 75, logo: "" },
        { name: "Zamalek", media: 74, logo: "" },
        { name: "Wydad Casablanca", media: 74, logo: "" },
        { name: "Al Ahly", media: 75, logo: "" },
        { name: "Mazembe", media: 70, logo: "" },
        { name: "Al-Hilal", media: 82, logo: "" },
        { name: "Al-Ittihad", media: 80, logo: "" },
        { name: "Al-Nassr", media: 81, logo: "" },
        { name: "Al-Ain", media: 75, logo: "" },
        { name: "Al-Sadd", media: 76, logo: "" },
        { name: "Yokohama Marinos", media: 72, logo: "" },
        { name: "Auckland City", media: 62, logo: "" },
        { name: "Lautoka", media: 49, logo: "" },
        //
        //
        { name: "All Boys", media: 65, logo: "" },
        { name: "Almagro", media: 64, logo: "" },
        { name: "Argentinos Juniors", media: 72, logo: "" },
        { name: "Arsenal de Sarandí", media: 67, logo: "" },
        { name: "Atlanta", media: 63, logo: "" },
        { name: "Atlético de Rafaela", media: 65, logo: "" },
        { name: "Chacarita", media: 67, logo: "" },
        { name: "Colón", media: 70, logo: "" },
        { name: "Ferro", media: 66, logo: "" },
        { name: "Gimnasia de Jujuy", media: 63, logo: "" },
        { name: "Godoy Cruz", media: 70, logo: "" },
        { name: "Huracán", media: 71, logo: "" },
        { name: "Instituto", media: 65, logo: "" },
        { name: "Quilmes", media: 67, logo: "" },
        { name: "San Martín (SJ)", media: 66, logo: "" },
        { name: "Sarmiento (J)", media: 66, logo: "" },
        { name: "Temperley", media: 67, logo: "" },
        { name: "Tigre", media: 68, logo: "" },
        { name: "Real Madrid", logo: "team1logo.png", media: 90 },
        { name: "Sevilla", logo: "team2logo.png", media: 82 },
        { name: "Vanuatu", media: 39, logo: "" },
        { name: "Samoa", media: 30, logo: "" },
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

    const [currentMinute, setCurrentMinute] = useState<string | number>(0);
    const [matchDuration, setMatchDuration] = useState<number | null>(null);
    const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
    const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
    const [specialChancesTeam1, setSpecialChancesTeam1] = useState(0);
    const [specialChancesTeam2, setSpecialChancesTeam2] = useState(0);
    const [goalsTeam1, setGoalsTeam1] = useState(0);
    const [goalsTeam2, setGoalsTeam2] = useState(0);
    const [team1, setTeam1] = useState({ name: "Real Madrid", logo: "team1logo.png", media: 90 });
    const [team2, setTeam2] = useState({ name: "Sevilla", logo: "team2logo.png", media: 82 });
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
        const chancesPlayed: Chance[] = simulateChances(team1, team2, specialChancesTeam1, specialChancesTeam2);
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

            </div>

            <div className="match-header">
                <h4>{team1.name} vs {team2.name}</h4>
            </div>

            <div className="team-select">
                <label htmlFor="team1-select">Seleccionar Equipo 1: </label>
                <select
                    id="team1-select"
                    value={team1.name}
                    onChange={handleTeam1Change}
                    disabled={isGameStarted}
                >
                    {teams.map((team) => (
                        <option key={team.name} value={team.name}>
                            {team.name} - {team.media}
                        </option>
                    ))}
                </select>
            </div>

            <div className="special-chances">
                <label>
                    Chances especiales equipo 1:
                    <input
                        type="number"
                        min="0"
                        max="15"
                        value={specialChancesTeam1}
                        onChange={(e) => setSpecialChancesTeam1(parseInt(e.target.value) || 0)}
                    />
                </label>
            </div>

            <div className="team-select special-chances">
                <label htmlFor="team2-select">Seleccionar Equipo 2: </label>
                <select
                    id="team2-select"
                    value={team2.name}
                    onChange={handleTeam2Change}
                    disabled={isGameStarted}
                >
                    {teams.map((team) => (
                        <option key={team.name} value={team.name}>
                            {team.name} - {team.media}
                        </option>
                    ))}
                </select>
            </div>

            <div className="special-chances">
                <label>
                    Chances especiales equipo 2:
                    <input
                        type="number"
                        min="0"
                        max="15"
                        value={specialChancesTeam2}
                        onChange={(e) => setSpecialChancesTeam2(parseInt(e.target.value) || 0)}
                    />
                </label>
            </div>


            <h5>{currentMinute}</h5>
            <h2>{goalsTeam1} - {goalsTeam2}</h2>

            <button onClick={playMatch} disabled={isGameStarted || matchDuration === null}>
                Jugar
            </button>

            <div className="score-container">
                <div className="score-inner">
                    <ul className="score-list">
                        {displayedChances.map((chance, index) => (
                            <li
                                key={index}
                                className={`score-item ${chance.team === team1.name ? 'left' : 'right'}`}
                            >
                                <span
                                    className={`score-text ${chance.isSpecial ? 'special' : ''} ${chance.team === team2.name ? 'align-left' : 'align-right'}`}
                                >
                                    {chance.team === team1.name
                                        ? chance.result === "Gol"
                                            ? `${chance.minute}' 🟢 Gol!`
                                            : `${chance.minute}' ❌ Errado`
                                        : chance.result === "Gol"
                                        ? `Gol! 🟢 ${chance.minute}'`
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
