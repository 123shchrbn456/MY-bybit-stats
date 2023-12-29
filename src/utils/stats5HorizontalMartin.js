function addResultToStatistic(type, outcome) {
    if (type === "win") {
        statistics.wins++;
        // statistics.winners.push(outcome);
        statistics.winnersElements.push(outcome.td);
    } else if (type === "lose") {
        statistics.loses++;
        // statistics.losers.push(outcome);
        statistics.losersElements.push(outcome.td);
    } else {
        throw new Error("Incorrect result type");
    }
}

function resetTrackingParamsOnNewRow() {
    tenBoxesTrend = "none";
    stakeTurn = 0;
    accumulatingWinningTurn = {
        value: 0,
        trend: "none",
    };
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

const chosenLeverage = "againstTrendX50";

const { WINNING_PERCENT_DOWN, WINNING_PERCENT_UP, LIQUIDATION_PERCENT_DOWN, LIQUIDATION_PERCENT_UP } = leverages[chosenLeverage];

let statistics = {
    max_iterations: MAX_ITERATION,
    wins: 0,
    loses: 0,
    losersElements: [],
    winnersElements: [],
};

let tenBoxesTrend = "none";
let stakeTurn = 0;
const MAX_ITERATION = 10;
let accumulatingWinningTurn = {
    value: 0,
    trend: "none",
};

export function tryToSee(data) {
    let singleArray = data.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
    console.log("singleArray", singleArray);
    singleArray.forEach((oneHourDataObj) => {
        scanData(oneHourDataObj);
    });
}

export function scanData(oneHourDataObj) {
    // let singleArray = data.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);

    // if (index === 0) resetTrackingParamsOnNewRow();

    const oneHourTrend = oneHourDataObj.priceChangedFor1Hour.className;
    const oneHourValue = Number(oneHourDataObj.priceChangedFor1Hour.value);

    if (accumulatingWinningTurn.trend !== "none") {
        accumulatingWinningTurn.value += oneHourValue;
        if (tenBoxesTrend === "positive" && accumulatingWinningTurn.value > LIQUIDATION_PERCENT_DOWN) {
            // Lose
            console.log("Accumulated LOSE TD value is " + oneHourValue);
            console.log("Accumulated value is " + accumulatingWinningTurn.value);
            td.classList.add("lose");
            td.textContent += "L";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", { td: td, message: "Accumulated LOSE" });
            return;
        }
        if (tenBoxesTrend === "positive" && accumulatingWinningTurn.value <= WINNING_PERCENT_DOWN) {
            // Win
            console.log("Accumulated WIN TD value is " + oneHourValue);
            console.log("Accumulated value is " + accumulatingWinningTurn.value);
            td.classList.add("win");
            td.textContent += "W";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", { td: td, message: "Accumulated WIN" });
            return;
        }
        if (tenBoxesTrend === "negative" && accumulatingWinningTurn.value < LIQUIDATION_PERCENT_UP) {
            // Lose
            console.log("Accumulated LOSE TD value is " + oneHourValue);
            console.log("Accumulated value is " + accumulatingWinningTurn.value);
            td.classList.add("lose");
            td.textContent += "L";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", { td: td, message: "Accumulated LOSE" });
            return;
        }
        if (tenBoxesTrend === "negative" && accumulatingWinningTurn.value >= WINNING_PERCENT_UP) {
            // Win
            console.log("Accumulated WIN TD value is " + oneHourValue);
            console.log("Accumulated value is " + accumulatingWinningTurn.value);
            td.classList.add("win");
            td.textContent += "W";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", { td: td, message: "Accumulated WIN" });
            return;
        }
    }

    // Срабатывает после 10и одинаковых догонов, на первой ячейке
    if (stakeTurn === MAX_ITERATION && tenBoxesTrend !== "none" && accumulatingWinningTurn.trend === "none") {
        if (tenBoxesTrend === "positive" && oneHourValue <= WINNING_PERCENT_DOWN) {
            // Immediate Win
            oneHourDataObj.outcome.className = "win";
            oneHourDataObj.outcome.text = "W";
            // td.classList.add("win");
            // td.textContent += "W";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("win", { td: td, message: "Immediate WIN" });
            return;
        }
        if (tenBoxesTrend === "negative" && oneHourValue >= WINNING_PERCENT_UP) {
            // Immediate Win
            td.classList.add("win");
            td.textContent += "W";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("win", { td: td, message: "Immediate WIN" });
            return;
        }
        if (tenBoxesTrend === "positive" && oneHourValue >= LIQUIDATION_PERCENT_UP) {
            // Immediate Lose
            console.log("Immediate Lose");
            td.classList.add("lose");
            td.textContent += "L";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", { td: td, message: "Immediate LOSE" });
            return;
        }
        if (tenBoxesTrend === "negative" && oneHourValue <= LIQUIDATION_PERCENT_DOWN) {
            // Immediate Lose
            console.log("Immediate Lose");
            td.classList.add("lose");
            td.textContent += "L";
            tenBoxesTrend = oneHourTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", { td: td, message: "Accumulated LOSE" });
            return;
        }

        accumulatingWinningTurn.trend = oneHourTrend;
        accumulatingWinningTurn.value = oneHourValue;
        return;
    }

    // Срабатывает
    if (tenBoxesTrend !== oneHourTrend && accumulatingWinningTurn.trend === "none") {
        tenBoxesTrend = oneHourTrend;
        stakeTurn = 1;
        return;
    }

    // Срабатывает когда мы добираем догоны до 10
    if (tenBoxesTrend === oneHourTrend && stakeTurn < MAX_ITERATION) {
        stakeTurn++;
        return;
    }
}
