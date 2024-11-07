function addResultToStatistic(type, outcome) {
    if (type === "win") {
        statistics.wins++;
        // statistics.winners.push(outcome);
        statistics.winnersElements.push(outcome);
    } else if (type === "lose") {
        statistics.loses++;
        // statistics.losers.push(outcome);
        statistics.losersElements.push(outcome);
    } else {
        throw new Error("Incorrect result type");
    }
    statistics.allStakes.push(outcome);
}

const leverages = {
    shortX100: {
        WINNING_PERCENT_DOWN: -1.14,
        LIQUIDATION_PERCENT_UP: 0.5,
    },
    shortX50: {
        WINNING_PERCENT_DOWN: -2.3,
        LIQUIDATION_PERCENT_UP: 1.5,
    },
    longX50: {
        WINNING_PERCENT_UP: 2.3,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
};

// const chosenLeverage = "shortX100";
const chosenLeverage = "shortX50";

const winLosePercentage = leverages[chosenLeverage];

const MAX_ITERATION = 8;

let statistics = {
    max_iterations: MAX_ITERATION,
    wins: 0,
    loses: 0,
    losersElements: [],
    winnersElements: [],
    allStakes: [],
};

let accumulatingBetPercentage = 0;

let betCountingIsStarted = false;
let DEMOBET_START_TIME = 12;
let MAX_DEMOBET_DAYS_LOSES_IN_A_ROW = 4;

export function tryToSee12HoursHorizontal(coinName, allMonthsResult) {
    statistics = {
        max_iterations: MAX_ITERATION,
        wins: 0,
        loses: 0,
        losersElements: [],
        winnersElements: [],
        allStakes: [],
    };
    allMonthsResult.forEach((oneHourDataObj) => {
        scanData12HoursHorizontal(oneHourDataObj, coinName);
    });

    const allStakes = statistics.allStakes.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log("allStakes", allStakes);

    return { data: allMonthsResult, allStakes };
}

export function scanData12HoursHorizontal(oneHourDataObj, coin) {
    const oneHourTrend = oneHourDataObj.priceChangedFor1Hour.className;
    const oneHourValue = Number(oneHourDataObj.priceChangedFor1Hour.value);

    // Если время этого часа меньше чем DEMOBET_START_TIME, тогда сразу возврат
    if (oneHourDataObj.finishedHour < DEMOBET_START_TIME && betCountingIsStarted === false) return oneHourDataObj;

    // Если подсчёты перескочили уже на следующий день и попали на DEMOBET_START_TIME
    if (oneHourDataObj.finishedHour === DEMOBET_START_TIME && betCountingIsStarted === true) {
        accumulatingBetPercentage += oneHourValue;
        return oneHourDataObj;
    }

    // Если первый раз попали на DEMOBET_START_TIME
    if (oneHourDataObj.finishedHour === DEMOBET_START_TIME && betCountingIsStarted === false) {
        betCountingIsStarted = true;
        accumulatingBetPercentage += oneHourValue;
        console.log("Первый раз попали на DEMOBET_START_TIME:", oneHourDataObj);
        return oneHourDataObj;
    }

    // Продолжаем добавлять процент за текущий час
    if (betCountingIsStarted === true) {
        accumulatingBetPercentage += oneHourValue;

        // Проигрышь при шорте
        if (accumulatingBetPercentage > winLosePercentage.LIQUIDATION_PERCENT_UP) {
            betCountingIsStarted = false;
            accumulatingBetPercentage = 0;
            oneHourDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            addResultToStatistic("lose", {
                oneHourDataObj: oneHourDataObj,
                message: "Immediate LOSE",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }

        // Выигрышь при шорте
        if (accumulatingBetPercentage < winLosePercentage.WINNING_PERCENT_DOWN) {
            betCountingIsStarted = false;
            accumulatingBetPercentage = 0;
            oneHourDataObj.outcome = {
                className: "win",
                text: "W",
            };
            addResultToStatistic("win", {
                oneHourDataObj: oneHourDataObj,
                message: "Immediate WIN",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        console.log("Продолжаем считать:", oneHourDataObj);
        console.log(accumulatingBetPercentage);
        return oneHourDataObj;
    }
    return;
}
