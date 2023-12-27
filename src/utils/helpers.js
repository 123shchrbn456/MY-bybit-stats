// const twoHundredHoursToMilsec = 200 * 60 * 60 * 1000;
// const todayDateMilsec = new Date().getTime();
// const twoHundredHoursBackMilsec = Number(todayDateMilsec) - twoHundredHoursToMilsec;

export const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const tryArr = [
    {
        finishedTime: new Date("Sun Mar 26 2023 01:00:00 GMT+0200"),
        finishedHour: 1,
        finishedDay: 26,
        month: 3,
        year: 2023,
        openPrice: "27432.9",
        closePrice: "27444.9",
        priceChangedFor1Hour: {
            className: "positive",
            value: "0.04",
        },
    },
];

function fillMissedDateObjects(arr) {
    for (let i = 0; i < arr.length; i++) {
        const currentCoinObj = arr[i];
        const nextCoinObj = arr[i + 1];
        const nextCoinObjActualFinishedTime = Number(nextCoinObj.finishedHour);
        const nextCoinObjCorrectFinishedTime = Number(currentCoinObj.finishedHour) + 1;

        if (nextCoinObjActualFinishedTime !== nextCoinObjCorrectFinishedTime) {
            console.warn("У следуюшего обьекта после этого, отсутсвует корректное время: ", currentCoinObj);
            console.warn("Индекс этого обьекта: ", i);
            const newCustomCoinObj = structuredClone(currentCoinObj);
            newCustomCoinObj.finishedTime.setHours(Number(currentCoinObj.finishedHour) + 1);
            newCustomCoinObj.finishedHour = Number(currentCoinObj.finishedHour) + 1;
            newCustomCoinObj.fakelyCreated = true;
            // Insert at exact position
            arr.splice(i + 1, 0, newCustomCoinObj);
        }
    }
    return arr;
}

// console.log(fillMissedDateObjects(tryArr));

export function calcPercentageDifference(closedPrice, openedPrice) {
    closedPrice = Number(closedPrice);
    openedPrice = Number(openedPrice);
    const result = ((closedPrice - openedPrice) / openedPrice) * 100;
    const className = Number(result) > 0 ? "positive" : "negative";
    return { className: className, value: result.toFixed(2) };
}

const dateStart4 = new Date(`November 25, 2023 00:00:00`).getTime();
const dateEnd4 = new Date(`November 25, 2023 23:00:00`).getTime();
const url8 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=60&start=1700863200000&end=1700946000000`;
const url9 = `https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&startTime=1700863200000&endTime=1700946000000`;
