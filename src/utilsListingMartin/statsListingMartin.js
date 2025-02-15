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
    longDemo: {
        WINNING_PERCENT_UP: 0.3,
        LIQUIDATION_PERCENT_DOWN: -0.3,
    },
    perfectLongX100: {
        WINNING_PERCENT_UP: 1,
        LIQUIDATION_PERCENT_DOWN: -1,
        // WINNING_PERCENT_UP: 0.57,
        // LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX100_10percent_take_profit: {
        WINNING_PERCENT_UP: 0.114,
        LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX100_25percent_take_profit: {
        WINNING_PERCENT_UP: 0.285,
        LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX100_150perc_profit: {
        WINNING_PERCENT_UP: 1.71,
        LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX100: {
        WINNING_PERCENT_UP: 1.14,
        LIQUIDATION_PERCENT_DOWN: -0.5,
    },
    longX50: {
        WINNING_PERCENT_UP: 2.3,
        LIQUIDATION_PERCENT_DOWN: -1.5,
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
    // shortX25: {
    //     LIQUIDATION_PERCENT_UP: 3.5,
    //     WINNING_PERCENT_DOWN: -4.3,
    // },
    shortX25: {
        LIQUIDATION_PERCENT_UP: 3,
        WINNING_PERCENT_DOWN: -4,
    },
    shortX10: {
        LIQUIDATION_PERCENT_UP: 9,
        WINNING_PERCENT_DOWN: -10,
    },
    shortX4: {
        LIQUIDATION_PERCENT_UP: 23,
        WINNING_PERCENT_DOWN: -25,
    },
    longX50: {
        WINNING_PERCENT_UP: 2.3,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    longX4: {
        WINNING_PERCENT_UP: 25,
        LIQUIDATION_PERCENT_DOWN: -23,
    },
};

// const chosenLeverage = "perfectLongX100";
// const chosenLeverage = "longX100_150perc_profit";
// const chosenLeverage = "longX100_10percent_take_profit";
// const chosenLeverage = "longX100_25percent_take_profit";
// const chosenLeverage = "longX100";
// const chosenLeverage = "longX50";
const chosenLeverage = "shortX4";
// const chosenLeverage = "longDemo";
// const chosenLeverage = "shortX100";
// const chosenLeverage = "shortX50";
// const chosenLeverage = "shortX25";
// const chosenLeverage = "shortX10";
// const chosenLeverage = "shortX100_25percent_take_profit";

const winLosePercentage = leverages[chosenLeverage];

let statistics = {
    wins: 0,
    loses: 0,
    losersElements: [],
    winnersElements: [],
    allStakes: [],
};

let accumulatingBetPercentage = 0;

let betCountingIsStartedInside = true;

// Основная функция
export function tryToSee5MinutesHorizontal(coinName, allMonthsResult) {
    statistics = {
        wins: 0,
        loses: 0,
        losersElements: [],
        winnersElements: [],
        allStakes: [],
    };
    // console.log(allMonthsResult);
    allMonthsResult.forEach((fiveMinutesDataObj) => {
        scanData5MinutesHorizontal(fiveMinutesDataObj, coinName);
    });
    betCountingIsStartedInside = true;

    const allStakes = statistics.allStakes.sort((a, b) => new Date(a.time) - new Date(b.time));
    if (allStakes[0] === undefined) {
        console.log(coinName, ":", undefined);
    }
    // Исход
    // Сделать что бы записывало в локал сторедж
    console.log(allStakes[0]);

    return { data: allMonthsResult, allStakes };
}

export function scanData5MinutesHorizontal(fiveMinutesDataObj, coin) {
    const fiveMinutesValue = Number(fiveMinutesDataObj.priceChangedFor1Hour.value);
    if (betCountingIsStartedInside === false) return fiveMinutesDataObj;

    // Продолжаем добавлять процент за текущий час
    if (betCountingIsStartedInside === true) {
        accumulatingBetPercentage += fiveMinutesValue;
        // console.log(accumulatingBetPercentage);

        // Проигрышь при лонге
        // if (accumulatingBetPercentage < winLosePercentage.LIQUIDATION_PERCENT_DOWN) {
        // Проигрышь при шорте
        if (accumulatingBetPercentage > winLosePercentage.LIQUIDATION_PERCENT_UP) {
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
            betCountingIsStartedInside = false;

            return fiveMinutesDataObj;
        }

        // Выигрышь при лонге
        // if (accumulatingBetPercentage > winLosePercentage.WINNING_PERCENT_UP) {
        // Выигрышь при шорте
        if (accumulatingBetPercentage < winLosePercentage.WINNING_PERCENT_DOWN) {
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
            betCountingIsStartedInside = false;

            return fiveMinutesDataObj;
        }
        // console.log("Продолжаем считать:", fiveMinutesDataObj);
        // console.log(accumulatingBetPercentage);
        return fiveMinutesDataObj;
    }
    return;
}
