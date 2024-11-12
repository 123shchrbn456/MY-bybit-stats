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
    longX100_25percent_take_profit: {
        WINNING_PERCENT_UP: 0.285,
        LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX100: {
        WINNING_PERCENT_UP: 1.14,
        LIQUIDATION_PERCENT_DOWN: -0.5,
        // WINNING_PERCENT_UP: 0.57,
        // LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    shortX100: {
        LIQUIDATION_PERCENT_UP: 0.5,
        WINNING_PERCENT_DOWN: -1.14,
    },
    shortX100_25percent_take_profit: {
        LIQUIDATION_PERCENT_UP: 0.5,
        WINNING_PERCENT_DOWN: -0.285,
    },
    shortX50: {
        LIQUIDATION_PERCENT_UP: 1.5,
        WINNING_PERCENT_DOWN: -2.3,
    },
    shortX25: {
        LIQUIDATION_PERCENT_UP: 3.5,
        WINNING_PERCENT_DOWN: -4.3,
    },
    shortX10: {
        LIQUIDATION_PERCENT_UP: 9.5,
        WINNING_PERCENT_DOWN: -11.4,
    },
    longX50: {
        WINNING_PERCENT_UP: 2.3,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
};

const chosenLeverageLongX100_25percent_take_profit = "longX100_25percent_take_profit";
const chosenLeverageShortX100_25percent_take_profit = "shortX100_25percent_take_profit";
const chosenLeverageLongX100 = "longX100";
const chosenLeverageShortX100 = "shortX100";
const chosenLeverageShortX50 = "shortX50";
const chosenLeverageShortX25 = "shortX25";
const chosenLeverageShortX10 = "shortX10";

const winLosePercentage = leverages[chosenLeverageShortX100_25percent_take_profit];

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
let DEMOBET_START_TIME_HOURS = 12;
let DEMOBET_START_TIME_MINUTES = 0;
let MAX_DEMOBET_DAYS_LOSES_IN_A_ROW = 4;

export function tryToSee5MinutesHorizontal(coinName, allMonthsResult) {
    statistics = {
        max_iterations: MAX_ITERATION,
        wins: 0,
        loses: 0,
        losersElements: [],
        winnersElements: [],
        allStakes: [],
    };
    allMonthsResult.forEach((fiveMinutesDataObj) => {
        scanData5MinutesHorizontal(fiveMinutesDataObj, coinName);
    });

    const allStakes = statistics.allStakes.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log("_________________________________________");
    console.log("allStakes", allStakes);
    let loseStreakToWait = 4;
    console.log("Плечё:", chosenLeverageShortX100_25percent_take_profit);
    // console.log("Количество лузов ждём:", loseStreakToWait);
    // const martin = findWinAfterLoseStreak(allStakes, loseStreakToWait);
    // console.log("Догонов стата:", martin);
    console.log("_________________________________________");

    return { data: allMonthsResult, allStakes };
}

export function scanData5MinutesHorizontal(fiveMinutesDataObj, coin) {
    const fiveMinutesValue = Number(fiveMinutesDataObj.priceChangedFor1Hour.value);

    // Если время этого часа меньше чем DEMOBET_START_TIME, тогда сразу возврат
    if (fiveMinutesDataObj.finishedHour < DEMOBET_START_TIME_HOURS && betCountingIsStarted === false) return fiveMinutesDataObj;

    // Если подсчёты перескочили уже на следующий день и попали на DEMOBET_START_TIME_HOURS и DEMOBET_START_TIME_MINUTES
    if (
        fiveMinutesDataObj.finishedHour === DEMOBET_START_TIME_HOURS &&
        fiveMinutesDataObj.finishedMinutes === DEMOBET_START_TIME_MINUTES &&
        betCountingIsStarted === true
    ) {
        accumulatingBetPercentage += fiveMinutesValue;
        return fiveMinutesDataObj;
    }

    // Если первый раз попали на DEMOBET_START_TIME_HOURS и DEMOBET_START_TIME_MINUTES
    if (
        fiveMinutesDataObj.finishedHour === DEMOBET_START_TIME_HOURS &&
        fiveMinutesDataObj.finishedMinutes === DEMOBET_START_TIME_MINUTES &&
        betCountingIsStarted === false
    ) {
        betCountingIsStarted = true;
        accumulatingBetPercentage += fiveMinutesValue;
        // console.log("Первый раз попали на DEMOBET_START_TIME:", fiveMinutesDataObj);
        return fiveMinutesDataObj;
    }

    // Продолжаем добавлять процент за текущий час
    if (betCountingIsStarted === true) {
        accumulatingBetPercentage += fiveMinutesValue;

        // Проигрышь при лонге
        // if (accumulatingBetPercentage < winLosePercentage.LIQUIDATION_PERCENT_DOWN) {
        // Проигрышь при шорте
        if (accumulatingBetPercentage > winLosePercentage.LIQUIDATION_PERCENT_UP) {
            betCountingIsStarted = false;
            accumulatingBetPercentage = 0;
            fiveMinutesDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            addResultToStatistic("lose", {
                fiveMinutesDataObj: fiveMinutesDataObj,
                message: "Immediate LOSE",
                time: fiveMinutesDataObj.finishedTime,
                coin,
            });
            return fiveMinutesDataObj;
        }

        // Выигрышь при лонге
        // if (accumulatingBetPercentage > winLosePercentage.WINNING_PERCENT_UP) {
        // Выигрышь при шорте
        if (accumulatingBetPercentage < winLosePercentage.WINNING_PERCENT_DOWN) {
            betCountingIsStarted = false;
            accumulatingBetPercentage = 0;
            fiveMinutesDataObj.outcome = {
                className: "win",
                text: "W",
            };
            addResultToStatistic("win", {
                fiveMinutesDataObj: fiveMinutesDataObj,
                message: "Immediate WIN",
                time: fiveMinutesDataObj.finishedTime,
                coin,
            });
            return fiveMinutesDataObj;
        }
        // console.log("Продолжаем считать:", fiveMinutesDataObj);
        // console.log(accumulatingBetPercentage);
        return fiveMinutesDataObj;
    }
    return;
}
