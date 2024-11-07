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
    // accordingTrendX50: {
    //     WINNING_PERCENT_UP: 2,
    //     WINNING_PERCENT_DOWN: -2,
    //     LIQUIDATION_PERCENT_UP: 1.5,
    //     LIQUIDATION_PERCENT_DOWN: -1.5,
    // },
    // accordingTrendX50_takeProfit50percent: {
    //     WINNING_PERCENT_UP: 1,
    //     WINNING_PERCENT_DOWN: -1,
    //     LIQUIDATION_PERCENT_UP: 1.5,
    //     LIQUIDATION_PERCENT_DOWN: -1.5,
    // },
    // accordingTrendX50_takeProfit25percent: {
    //     WINNING_PERCENT_UP: 0.5,
    //     WINNING_PERCENT_DOWN: -0.5,
    //     LIQUIDATION_PERCENT_UP: 1.5,
    //     LIQUIDATION_PERCENT_DOWN: -1.5,
    // },

    againstTrendX50: {
        WINNING_PERCENT_UP: 2,
        WINNING_PERCENT_DOWN: -2,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    againstTrendX50_50perc_profit: {
        WINNING_PERCENT_UP: 1,
        WINNING_PERCENT_DOWN: -1,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    againstTrendX50_halfPerc_profit: {
        WINNING_PERCENT_UP: 0.5,
        WINNING_PERCENT_DOWN: -0.5,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    X50_2perc_liquidate: {
        WINNING_PERCENT_UP: 2,
        WINNING_PERCENT_DOWN: -2,
        LIQUIDATION_PERCENT_UP: 2,
        LIQUIDATION_PERCENT_DOWN: -2,
    },
    againstTrendX50_takeProfit50percent: {
        WINNING_PERCENT_UP: 1,
        WINNING_PERCENT_DOWN: -1,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    // accordingTrendX20: {
    //     WINNING_PERCENT_UP: 5,
    //     WINNING_PERCENT_DOWN: -5,
    //     LIQUIDATION_PERCENT_UP: 4,
    //     LIQUIDATION_PERCENT_DOWN: -4,
    // },
    // againstTrendX20: {
    //     WINNING_PERCENT_UP: 5,
    //     WINNING_PERCENT_DOWN: -5,
    //     LIQUIDATION_PERCENT_UP: 4,
    //     LIQUIDATION_PERCENT_DOWN: -4,
    // },
};

const chosenLeverage = "againstTrendX50_50perc_profit";
// const chosenLeverage = "X50_2perc_liquidate";
// const chosenLeverage = "againstTrendX50_1perc_profit";
// const chosenLeverage = "againstTrendX50_halfPerc_profit";

const { WINNING_PERCENT_DOWN, WINNING_PERCENT_UP, LIQUIDATION_PERCENT_DOWN, LIQUIDATION_PERCENT_UP } = leverages[chosenLeverage];

let tenBoxesTrend = "none";
let stakeTurn = 0;
const MAX_ITERATION = 8;
let accumulatingWinningTurn = {
    value: 0,
    trend: "none",
};

let statistics = {
    max_iterations: MAX_ITERATION,
    wins: 0,
    loses: 0,
    losersElements: [],
    winnersElements: [],
    allStakes: [],
};

export function tryToSee(coinName, data) {
    statistics = {
        max_iterations: MAX_ITERATION,
        wins: 0,
        loses: 0,
        losersElements: [],
        winnersElements: [],
        allStakes: [],
    };
    data.forEach((oneHourDataObj) => {
        console.log("oneHourDataObj", oneHourDataObj);
        scanData(oneHourDataObj, coinName);
    });

    console.log(
        `W/L:${statistics.wins - statistics.loses}|| WINS:${statistics.wins}|| LOSES:${
            statistics.loses
        }|| COIN:${coinName}|| ПЛЕЧЁ:${chosenLeverage}|| ДОГОНЫ:${MAX_ITERATION}`
    );
    const allStakes = statistics.allStakes.sort((a, b) => new Date(a.time) - new Date(b.time));
    console.log(`COIN:${coinName}`, allStakes);
    // console.log(statistics);
    return { data, allStakes };
}

export function scanData(oneHourDataObj, coin) {
    const oneHourTrend = oneHourDataObj.priceChangedFor1Hour.className;
    const oneHourValue = Number(oneHourDataObj.priceChangedFor1Hour.value);

    if (accumulatingWinningTurn.trend !== "none") {
        accumulatingWinningTurn.value += oneHourValue;
        if (tenBoxesTrend === "positive" && accumulatingWinningTurn.value <= WINNING_PERCENT_DOWN) {
            // Win
            oneHourDataObj.outcome = {
                className: "win",
                text: "W",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", {
                oneHourDataObj: oneHourDataObj,
                message: "Accumulated WIN",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        if (tenBoxesTrend === "negative" && accumulatingWinningTurn.value >= WINNING_PERCENT_UP) {
            // Win
            oneHourDataObj.outcome = {
                className: "win",
                text: "W",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", {
                oneHourDataObj: oneHourDataObj,
                message: "Accumulated WIN",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        if (tenBoxesTrend === "positive" && accumulatingWinningTurn.value >= LIQUIDATION_PERCENT_UP) {
            // Lose
            oneHourDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", {
                oneHourDataObj: oneHourDataObj,
                message: "Accumulated LOSE",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        tenBoxesTrend === "negative" && oneHourValue <= LIQUIDATION_PERCENT_DOWN;
        if (tenBoxesTrend === "negative" && accumulatingWinningTurn.value <= LIQUIDATION_PERCENT_DOWN) {
            // Lose
            oneHourDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", {
                oneHourDataObj: oneHourDataObj,
                message: "Accumulated LOSE",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
    }

    // Срабатывает после 10и одинаковых догонов, на первой ячейке
    if (stakeTurn === MAX_ITERATION && tenBoxesTrend !== "none" && accumulatingWinningTurn.trend === "none") {
        if (tenBoxesTrend === "positive" && oneHourValue <= WINNING_PERCENT_DOWN) {
            // Immediate Win
            oneHourDataObj.outcome = {
                className: "win",
                text: "W",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("win", {
                oneHourDataObj: oneHourDataObj,
                message: "Immediate WIN",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        if (tenBoxesTrend === "negative" && oneHourValue >= WINNING_PERCENT_UP) {
            // Immediate Win
            oneHourDataObj.outcome = {
                className: "win",
                text: "W",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("win", {
                oneHourDataObj: oneHourDataObj,
                message: "Immediate WIN",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        if (tenBoxesTrend === "positive" && oneHourValue >= LIQUIDATION_PERCENT_UP) {
            // Immediate Lose
            oneHourDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", {
                oneHourDataObj: oneHourDataObj,
                message: "Immediate LOSE",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }
        if (tenBoxesTrend === "negative" && oneHourValue <= LIQUIDATION_PERCENT_DOWN) {
            // Immediate Lose
            oneHourDataObj.outcome = {
                className: "lose",
                text: "L",
            };
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", {
                oneHourDataObj: oneHourDataObj,
                message: "Accumulated LOSE",
                time: oneHourDataObj.finishedTime,
                coin,
            });
            return oneHourDataObj;
        }

        accumulatingWinningTurn.trend = oneHourTrend;
        accumulatingWinningTurn.value = oneHourValue;
        return oneHourDataObj;
    }

    // Срабатывает при изменении цвета, когда ещё не набралось 10 догонов
    if (tenBoxesTrend !== oneHourTrend && accumulatingWinningTurn.trend === "none") {
        tenBoxesTrend = oneHourTrend;
        stakeTurn = 1;
        return oneHourDataObj;
    }

    // Срабатывает когда мы добираем догоны до 10
    if (tenBoxesTrend === oneHourTrend && stakeTurn < MAX_ITERATION) {
        stakeTurn++;
        return oneHourDataObj;
    }
}
