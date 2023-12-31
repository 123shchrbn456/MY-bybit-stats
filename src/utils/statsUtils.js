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
    threeBoxesTrend = "none";
    stakeTurn = 0;
    accumulatingWinningTurn = {
        value: 0,
        trend: "none",
    };
}

const leverages = {
    accordingTrendX50: {
        WINNING_PERCENT_UP: 2,
        WINNING_PERCENT_DOWN: -2,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    accordingTrendX50_takeProfit50percent: {
        WINNING_PERCENT_UP: 1,
        WINNING_PERCENT_DOWN: -1,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },
    accordingTrendX50_takeProfit25percent: {
        WINNING_PERCENT_UP: 0.5,
        WINNING_PERCENT_DOWN: -0.5,
        LIQUIDATION_PERCENT_UP: 1.5,
        LIQUIDATION_PERCENT_DOWN: -1.5,
    },

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
    // accordingTrendX10: {
    //     WINNING_PERCENT_UP: 10,
    //     WINNING_PERCENT_DOWN: -10,
    //     LIQUIDATION_PERCENT_UP: 9,
    //     LIQUIDATION_PERCENT_DOWN: -9,
    // },
    // againstTrendX10: {
    //     WINNING_PERCENT_UP: 10,
    //     WINNING_PERCENT_DOWN: -10,
    //     LIQUIDATION_PERCENT_UP: 9,
    //     LIQUIDATION_PERCENT_DOWN: -9,
    // },

    // x10: {
    //     WINNING_PERCENT_DOWN: -10,
    //     WINNING_PERCENT_UP: 10,
    //     LIQUIDATION_PERCENT_DOWN: 9,
    //     LIQUIDATION_PERCENT_UP: -9,
    // },
    // x5: {
    //     WINNING_PERCENT_DOWN: -20,
    //     WINNING_PERCENT_UP: 20,
    //     LIQUIDATION_PERCENT_DOWN: 19,
    //     LIQUIDATION_PERCENT_UP: -19,
    // },
};

// const chosenLeverage = "againstTrendX50";
// const chosenLeverage = "againstTrendX20";
// const chosenLeverage = "againstTrendX10";
// const chosenLeverage = "accordingTrendX50";
// const chosenLeverage = "accordingTrendX20";
const chosenLeverage = "accordingTrendX50_takeProfit25percent";

const { WINNING_PERCENT_DOWN, WINNING_PERCENT_UP, LIQUIDATION_PERCENT_DOWN, LIQUIDATION_PERCENT_UP } = leverages[chosenLeverage];

const MAX_ITERATION = 13;

let statistics = {
    max_iterations: MAX_ITERATION,
    wins: 0,
    loses: 0,
    // winners: [],
    // losers: [],
    losersElements: [],
    winnersElements: [],
};

let threeBoxesTrend = "none";
let stakeTurn = 0;
let accumulatingWinningTurn = {
    value: 0,
    trend: "none",
};

function getNextSiblings(elem, filter) {
    var sibs = [];

    while ((elem = elem.nextSibling)) {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}

// СКАНИРУЕМ РЯД ВПРАВО
function scanRowForWinOrLose(td, searchNextRow = false) {
    // console.log("С нее началось", td);
    const nextSiblingsArr = getNextSiblings(td);
    const tdTrend = td.dataset.trend;
    const tdValue = Number(td.dataset.value);
    if (!searchNextRow) {
        accumulatingWinningTurn.trend = tdTrend;
        accumulatingWinningTurn.value = tdValue;
    }
    if (searchNextRow) {
        accumulatingWinningTurn.trend = tdTrend;
        accumulatingWinningTurn.value += tdValue;
    }

    let isFindedResult = false;

    //
    nextSiblingsArr.forEach((elem) => {
        const elemTrend = elem.dataset.trend;
        const elemValue = Number(elem.dataset.value);
        accumulatingWinningTurn.value += elemValue;
        if (stakeTurn === 1) return;
        /* According trend win */
        if (threeBoxesTrend === "positive" && accumulatingWinningTurn.value >= WINNING_PERCENT_UP) {
            /* Against trend win*/
            // if (threeBoxesTrend === "positive" && accumulatingWinningTurn.value <= WINNING_PERCENT_DOWN) {
            isFindedResult = true;
            elem.classList.add("win");
            elem.textContent += "W";
            threeBoxesTrend = elemTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", { td: elem, message: "Accumulated WIN" });
            return;
        }
        /* According trend Win*/
        if (threeBoxesTrend === "negative" && accumulatingWinningTurn.value <= WINNING_PERCENT_DOWN) {
            /* Against trend Win */
            // if (threeBoxesTrend === "negative" && accumulatingWinningTurn.value >= WINNING_PERCENT_UP) {
            isFindedResult = true;
            elem.classList.add("win");
            elem.textContent += "W";
            threeBoxesTrend = elemTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("win", { td: elem, message: "Accumulated WIN" });
            return;
        }
        /* According trend Lose */
        if (threeBoxesTrend === "positive" && accumulatingWinningTurn.value <= LIQUIDATION_PERCENT_DOWN) {
            /* Against trend Lose */
            // if (threeBoxesTrend === "positive" && accumulatingWinningTurn.value >= LIQUIDATION_PERCENT_UP) {
            isFindedResult = true;
            elem.classList.add("lose");
            elem.textContent += "L";
            threeBoxesTrend = elemTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", { td: elem, message: "Accumulated LOSE" });
            return;
        }
        /* According trend Lose */
        if (threeBoxesTrend === "negative" && accumulatingWinningTurn.value >= LIQUIDATION_PERCENT_UP) {
            /* Against trend Lose */
            // if (threeBoxesTrend === "negative" && accumulatingWinningTurn.value <= LIQUIDATION_PERCENT_DOWN) {
            isFindedResult = true;
            elem.classList.add("lose");
            elem.textContent += "L";
            threeBoxesTrend = elemTrend;
            stakeTurn = 1;
            accumulatingWinningTurn.value = 0;
            accumulatingWinningTurn.trend = "none";
            addResultToStatistic("lose", { td: elem, message: "Accumulated LOSE" });
            return;
        }
    });
    if (!isFindedResult) {
        // console.log("Для этого элемента в этом ряде не найдено исхода:");
        const currentRow = td.parentElement;
        const nextRow = currentRow.nextSibling;
        if (!nextRow) {
            return;
        }
        const startTd = nextRow.children[1]; /* [0] - ячейка дня.месяца */
        scanRowForWinOrLose(startTd, true);
    }

    // закладка
}

function scanColumn(td, index) {
    if (index === 0) resetTrackingParamsOnNewRow();
    const tdTrend = td.dataset.trend;
    const tdValue = Number(td.dataset.value);
    /* 
        -----------------------------CONDITIONS START--------------------
    */

    // Мгновенные проигрыши или выигрыши
    if (stakeTurn === MAX_ITERATION && threeBoxesTrend !== "none" && accumulatingWinningTurn.trend === "none") {
        /* According trend Win*/
        if (threeBoxesTrend === "positive" && tdValue >= WINNING_PERCENT_UP) {
            // /* Against trend Win*/
            // if (threeBoxesTrend === "positive" && tdValue <= WINNING_PERCENT_DOWN) {
            td.classList.add("win");
            td.textContent += "W";
            // console.log(td);
            threeBoxesTrend = tdTrend;
            stakeTurn = 1;
            addResultToStatistic("win", { td: td, message: "Immediate WIN" });
            return;
        }
        /* According trend Win*/
        if (threeBoxesTrend === "negative" && tdValue <= WINNING_PERCENT_DOWN) {
            /* Against trend Win */
            // if (threeBoxesTrend === "negative" && tdValue >= WINNING_PERCENT_UP) {
            td.classList.add("win");
            td.textContent += "W";
            // console.log(td);
            threeBoxesTrend = tdTrend;
            stakeTurn = 1;
            addResultToStatistic("win", { td: td, message: "Immediate WIN" });
            return;
        }

        /* According trend Lose */
        if (threeBoxesTrend === "positive" && tdValue <= LIQUIDATION_PERCENT_DOWN) {
            /* Against trend Lose */
            // if (threeBoxesTrend === "positive" && tdValue >= LIQUIDATION_PERCENT_UP) {
            td.classList.add("lose");
            td.textContent += "L";
            threeBoxesTrend = tdTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", { td: td, message: "Immediate LOSE" });
            return;
        }
        /* According trend Lose */
        if (threeBoxesTrend === "negative" && tdValue >= LIQUIDATION_PERCENT_UP) {
            /* Against trend Lose  */
            // if (threeBoxesTrend === "negative" && tdValue <= LIQUIDATION_PERCENT_DOWN) {
            td.classList.add("lose");
            td.textContent += "L";
            threeBoxesTrend = tdTrend;
            stakeTurn = 1;
            addResultToStatistic("lose", { td: td, message: "Immediate LOSE" });
            return;
        }

        // Начинаем ACCAMULATING!
        // Стартовать функцию уже здесь, в которую передавать td!
        scanRowForWinOrLose(td);
        return;
    }

    // Обнуляем счётчик догонов
    if (threeBoxesTrend !== tdTrend && accumulatingWinningTurn.trend === "none") {
        threeBoxesTrend = tdTrend;
        stakeTurn = 1;
        return;
    }
    // Ячейка с таким же трендом как предидущая и количество одинаковых всё ещё набирается
    if (threeBoxesTrend === tdTrend && stakeTurn < MAX_ITERATION) {
        stakeTurn++;
        return;
    }
}

export function calculateStatistic(coin, iteration) {
    return () => {
        statistics = {
            max_iterations: MAX_ITERATION,
            wins: 0,
            loses: 0,
            // winners: [],
            // losers: [],
            losersElements: [],
            winnersElements: [],
        };
        const tds = document.querySelectorAll("td");
        tds.forEach((td) => {
            td.classList.remove("lose");
            td.classList.remove("win");
        });

        const td1 = document.querySelectorAll(".td1");
        const td2 = document.querySelectorAll(".td2");
        const td3 = document.querySelectorAll(".td3");
        const td4 = document.querySelectorAll(".td4");
        const td5 = document.querySelectorAll(".td5");
        const td6 = document.querySelectorAll(".td6");
        const td7 = document.querySelectorAll(".td7");
        const td8 = document.querySelectorAll(".td8");
        const td9 = document.querySelectorAll(".td9");
        const td10 = document.querySelectorAll(".td10");
        const td11 = document.querySelectorAll(".td11");
        const td12 = document.querySelectorAll(".td12");
        const td13 = document.querySelectorAll(".td13");
        const td14 = document.querySelectorAll(".td14");
        const td15 = document.querySelectorAll(".td15");
        const td16 = document.querySelectorAll(".td16");
        const td17 = document.querySelectorAll(".td17");
        const td18 = document.querySelectorAll(".td18");
        const td19 = document.querySelectorAll(".td19");
        const td20 = document.querySelectorAll(".td20");
        const td21 = document.querySelectorAll(".td21");
        const td22 = document.querySelectorAll(".td22");
        const td23 = document.querySelectorAll(".td23");
        const td24 = document.querySelectorAll(".td24");
        td1.forEach(scanColumn);
        td2.forEach(scanColumn);
        td3.forEach(scanColumn);
        td4.forEach(scanColumn);
        td5.forEach(scanColumn);
        td6.forEach(scanColumn);
        td7.forEach(scanColumn);
        td8.forEach(scanColumn);
        td9.forEach(scanColumn);
        td10.forEach(scanColumn);
        td11.forEach(scanColumn);
        td12.forEach(scanColumn);
        td13.forEach(scanColumn);
        td14.forEach(scanColumn);
        td15.forEach(scanColumn);
        td16.forEach(scanColumn);
        td17.forEach(scanColumn);
        td18.forEach(scanColumn);
        td19.forEach(scanColumn);
        td20.forEach(scanColumn);
        td21.forEach(scanColumn);
        td22.forEach(scanColumn);
        td23.forEach(scanColumn);
        td24.forEach(scanColumn);
        // console.log(statistics);
        // return "WINS: ", statistics.wins, "LOSES: ", statistics.loses
        return `WINS:${statistics.wins}|| LOSES:${statistics.loses}|| COIN:${coin}|| ПЛЕЧЁ:${chosenLeverage}|| ДОГОНЫ:${MAX_ITERATION}`;
        console.log("WINS: ", statistics.wins, "LOSES: ", statistics.loses);
        console.log("ITERATIONS: ", MAX_ITERATION);
    };
}
