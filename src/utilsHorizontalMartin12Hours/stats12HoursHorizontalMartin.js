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

function findWinAfterLoseStreak(data, MAX_LOSE_STREAK = 6) {
    // const MAX_LOSE_STREAK = 6;
    const result = [];
    let loseCount = 0; // Счетчик для последовательных "LOSE"

    for (let i = 0; i < data.length; i++) {
        if (data[i].message === "Immediate LOSE") {
            loseCount++; // Увеличиваем счетчик при "LOSE"
        } else {
            loseCount = 0; // Сбрасываем, если не "LOSE"
        }

        // Если находим три подряд "LOSE", ищем следующий "WIN"
        if (loseCount === MAX_LOSE_STREAK) {
            let itemNumberAfterLoseStrick = i + 1;
            if (itemNumberAfterLoseStrick < data.length) {
                result.push(data[itemNumberAfterLoseStrick]);
                loseCount = 0;
            }
            // Сбрасываем счетчик и продолжаем поиск
            // loseCount = 0;
        }
    }
    return result;
}

const leverages = {
    shortX100: {
        LIQUIDATION_PERCENT_UP: 0.5,
        WINNING_PERCENT_DOWN: -1.14,
    },
    shortX50: {
        LIQUIDATION_PERCENT_UP: 1.5,
        WINNING_PERCENT_DOWN: -2.3,
    },
    shortX25: {
        LIQUIDATION_PERCENT_UP: 3.5,
        WINNING_PERCENT_DOWN: -4.3,
    },
    longX50: {
        WINNING_PERCENT_UP: 2.3,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
};

// const chosenLeverage = "shortX100";
const chosenLeverageShortX50 = "shortX50";
const chosenLeverageShortX25 = "shortX25";

const winLosePercentage = leverages[chosenLeverageShortX25];

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
    console.log("_________________________________________");
    console.log("allStakes", allStakes);
    let loseStreakToWait = 6;
    const martin = findWinAfterLoseStreak(allStakes, loseStreakToWait);
    chosenLeverageShortX25;
    console.log("Плечё:", chosenLeverageShortX25);
    console.log("Количество лузов ждём:", loseStreakToWait);
    console.log("Догонов стата:", martin);
    console.log("_________________________________________");

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
        // console.log("Первый раз попали на DEMOBET_START_TIME:", oneHourDataObj);
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
        // console.log("Продолжаем считать:", oneHourDataObj);
        // console.log(accumulatingBetPercentage);
        return oneHourDataObj;
    }
    return;
}
