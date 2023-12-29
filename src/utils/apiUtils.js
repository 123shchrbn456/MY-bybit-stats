// const dateStart1 = new Date(`March 26, 2023 00:00:00`).getTime();
// const dateEnd1 = new Date(`March 26, 2023 23:00:00`).getTime();

import { calcPercentageDifference, chunkArray } from "./helpers";

async function getSingleAPIRequest(url, monthName = "none", urlIntervalParam) {
    // let timezoneDay = month.name === "March" ? 26 : month.name === "October" ? 29 : null;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const coinsData = data.result.list.reverse();

        let newArr = coinsData.map((coinData) => ({
            finishedTime: new Date(Number(coinData[0])),
            finishedHour: new Date(Number(coinData[0])).getHours(),
            finishedDay: new Date(Number(coinData[0])).getDate(),
            month: new Date(Number(coinData[0])).getMonth() + 1,
            year: new Date(Number(coinData[0])).getFullYear(),
            openPrice: coinData[1],
            closePrice: coinData[4],
            priceChangedFor1Hour: calcPercentageDifference(coinData[4], coinData[1]),
        }));

        newArr.sort((a, b) => new Date(a.finishedDay) - new Date(b.finishedDay));
        // console.log("getSingleAPIRequest_SORTED", newArr);
        if (urlIntervalParam === "1hour" && monthName === "March") {
            const insertionIndex = 27;
            const newCustomCoinObj = structuredClone(newArr[insertionIndex]);
            // console.log("March", newCustomCoinObj);
            // newCustomCoinObj.finishedTime = new Date(1679792400000);
            //
            newCustomCoinObj.finishedTime.setHours(3); /* ПЕРЕДЕЛАТЬ! */
            newCustomCoinObj.finishedHour = 3;
            newCustomCoinObj.fakelyCreated = true;
            newArr.splice(insertionIndex, 0, newCustomCoinObj); /* вставляем новый обьект */
            // console.log("В индексе 27 фейкли криейтед", newArr);
        }
        if (urlIntervalParam === "1hour" && monthName === "October") {
            const editingIndex = 99;
            const deletingIndex = 100;
            const changedFor1Hour =
                Number(newArr[editingIndex].priceChangedFor1Hour.value) + Number(newArr[deletingIndex].priceChangedFor1Hour.value);
            newArr[deletingIndex - 1];
            newArr[editingIndex].priceChangedFor1Hour.value = changedFor1Hour;
            newArr[editingIndex].fakelyCreated = true;
            newArr.splice(deletingIndex, 1); /* удаляем один обьект */
        }
        let chunks;
        if (urlIntervalParam === "1hour") {
            chunks = chunkArray(newArr, 24); /* для реквестов &interval=60*/
        } else if (urlIntervalParam === "4hour") {
            chunks = chunkArray(newArr, 6); /* для реквестов &interval=60*/
        } else {
            console.error("urlIntervalParam is not passed or incorrect");
        }

        // const chunks = chunkArray(newArr, 6);/* для реквестов &interval=240*/
        return chunks;
    } catch (error) {
        console.error(error);
    }
}

// 1 часовой интервал
export async function createOneMonthRequestLinks1HourInterval(coin, month) {
    const dateStart1 = new Date(`${month.name} 01, ${month.year} 00:00:00`).getTime();
    const dateEnd1 = new Date(`${month.name} 08, ${month.year} 23:00:00`).getTime();
    const dateStart2 = new Date(`${month.name} 09, ${month.year} 00:00:00`).getTime();
    const dateEnd2 = new Date(`${month.name} 16, ${month.year} 23:00:00`).getTime();
    const dateStart3 = new Date(`${month.name} 17, ${month.year} 00:00:00`).getTime();
    const dateEnd3 = new Date(`${month.name} 24, ${month.year} 23:00:00`).getTime();
    const dateStart4 = new Date(`${month.name} 25, ${month.year} 00:00:00`).getTime();
    const dateEnd4 = new Date(`${month.name} ${month.days}, ${month.year} 23:00:00`).getTime();
    const url1 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart1}&end=${dateEnd1}`;
    const url2 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart2}&end=${dateEnd2}`;
    const url3 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart3}&end=${dateEnd3}`;
    const url4 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart4}&end=${dateEnd4}`;
    const allPromises = Promise.all([
        getSingleAPIRequest(url1, month.name, "1hour"),
        getSingleAPIRequest(url2, month.name, "1hour"),
        getSingleAPIRequest(url3, month.name, "1hour"),
        getSingleAPIRequest(url4, month.name, "1hour"),
    ]);
    try {
        const promiseResult = await allPromises;
        // Изменить promiseResult[4] если месяц март или октябрь
        let singArrayOneMonthData = promiseResult.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
        return singArrayOneMonthData;
    } catch (err) {
        console.error(err);
    }
}

// 4 часовой интервал
export async function createOneMonthRequestLinks4HoursInterval(coin, month) {
    const dateStart = new Date(`${month.name} 01, ${month.year} 00:00:00`).getTime();
    const dateEnd = new Date(`${month.name} ${month.days}, ${month.year} 23:00:00`).getTime();
    const url = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=240&start=${dateStart}&end=${dateEnd}`;
    try {
        let singArrayOneMonthData = await getSingleAPIRequest(url, month.name, "4hour");
        return singArrayOneMonthData;
    } catch (err) {
        console.error(err);
    }
}
