
import { useEffect, useState } from "react";

let team1; //Acá llamo a los datos del equipo 1
let team2;

let matchDuration: number = 0.05;
const halfDuration: number = 45;

let team1Name: string; //Esto es igual a team1.name
let team2Name: string;

let team1Logo: string; //Esto es igual a team1.logo
let team2Logo: string;

let team1Chances: number; //Esto es igual a team1.chances
let team2Chances: number;

let goalsTeam1 = 0;
let goalsTeam2 = 0;

const getRandomTime = (): number => {
    return Math.floor(Math.random() * (49 - 46 + 1)) + 46;
};

const firstHalfTime = getRandomTime();
const secondHalfTime = getRandomTime();

let currentMinute: string | number = 1;

function simulateHalf(timeLimit: number, offset: number, endMessage: string, callback?: () => void) {
    let simulatedMinutes = 1;
    const intervalDuration = (matchDuration * 60 * 1000) / 90;
    
    const intervalId = setInterval(() => {
        if (simulatedMinutes <= halfDuration) {
            currentMinute = simulatedMinutes + offset;
        } else {
            console.log("simulatedMinutes", simulatedMinutes);
            currentMinute = `${halfDuration + offset}+`;
        }
        
        console.log(`Minuto actual: ${currentMinute}`);
        simulatedMinutes++;

        if (simulatedMinutes > timeLimit) {
            clearInterval(intervalId);
            console.log(endMessage);
            if (callback) callback();
        }
    }, intervalDuration);
}

function simulateTime() {
    simulateHalf(firstHalfTime, 0, "Entretiempo", () => {
        setTimeout(() => {
            simulateHalf(secondHalfTime, 45, "Fin del partido");
        }, 1000);
    });
}

simulateTime();

const Score = () => {
    return (
        <div>
            <h5>{currentMinute}</h5>
            <h2>{goalsTeam1} - {goalsTeam2}</h2>
        </div>
    )
}

export default Score;
