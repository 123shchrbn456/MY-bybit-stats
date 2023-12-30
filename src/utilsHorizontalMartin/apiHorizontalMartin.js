// const dateStart1 = new Date(`March 26, 2023 00:00:00`).getTime();
// const dateEnd1 = new Date(`March 26, 2023 23:00:00`).getTime();

import { calcPercentageDifference, chunkArray } from "../utils//helpers";

async function getSingleAPIRequest(url, monthName = "none", urlIntervalParam) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        const coinsData = data; /* При использовании  Binance API */
        // const coinsData = data.result.list.reverse(); /* При использовании  Bybit API */

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
        if (urlIntervalParam === "1hour" && monthName === "March") {
            const insertionIndex = 603;
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
            const editingIndex = 674;
            const deletingIndex = 675;
            const changedFor1Hour =
                Number(newArr[editingIndex].priceChangedFor1Hour.value) + Number(newArr[deletingIndex].priceChangedFor1Hour.value);
            newArr[deletingIndex - 1];
            newArr[editingIndex].priceChangedFor1Hour.value = changedFor1Hour;
            newArr[editingIndex].fakelyCreated = true;
            newArr.splice(deletingIndex, 1); /* удаляем один обьект */
        }
        return newArr;
    } catch (error) {
        // console.log("Ошибка при этой ссылке", url);
        console.error(error);
    }
}

// 1 часовой интервал
export async function getOneMonthData1HourInterval(coin, month) {
    const dateStart1 = new Date(`${month.name} 01, ${month.year} 00:00:00`).getTime();
    const dateEnd1 = new Date(`${month.name} 08, ${month.year} 23:00:00`).getTime();
    const dateStart2 = new Date(`${month.name} 09, ${month.year} 00:00:00`).getTime();
    const dateEnd2 = new Date(`${month.name} 16, ${month.year} 23:00:00`).getTime();
    const dateStart3 = new Date(`${month.name} 17, ${month.year} 00:00:00`).getTime();
    const dateEnd3 = new Date(`${month.name} 24, ${month.year} 23:00:00`).getTime();
    const dateStart4 = new Date(`${month.name} 25, ${month.year} 00:00:00`).getTime();
    const dateEnd4 = new Date(`${month.name} ${month.days}, ${month.year} 23:00:00`).getTime();
    // Bybit ссылки
    // const url1 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart1}&end=${dateEnd1}`;
    // const url2 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart2}&end=${dateEnd2}`;
    // const url3 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart3}&end=${dateEnd3}`;
    // const url4 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${coin}USDT&interval=60&start=${dateStart4}&end=${dateEnd4}`;
    // Binance ссылки
    const urlBinance = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1h&startTime=${dateStart1}&endTime=${dateEnd4}&limit=1500`;
    // const url2 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1h&startTime=${dateStart2}&endTime=${dateEnd2}`;
    // const url3 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1h&startTime=${dateStart3}&endTime=${dateEnd3}`;
    // const url4 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=1h&startTime=${dateStart4}&endTime=${dateEnd4}`;
    // const allPromises = Promise.all([
    //     getSingleAPIRequest(url1, undefined, "1hour"),
    //     getSingleAPIRequest(url2, undefined, "1hour"),
    //     getSingleAPIRequest(url3, undefined, "1hour"),
    //     getSingleAPIRequest(url4, month.name, "1hour"),
    // ]);

    try {
        const oneMonthData = await getSingleAPIRequest(urlBinance, month.name, "1hour");
        // Изменить promiseResult[4] если месяц март или октябрь
        // let singArrayOneMonthData = oneMonthData.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
        const singArrayOneMonthData = oneMonthData;
        if (singArrayOneMonthData.length !== month.days * 24) {
            console.error("В выбранном месяца не все данные или их нету");
            console.error("Монета: ", coin, " .Месяц: ", month.name, " .Количество дней в месяце: ", month.days);
            console.error("Длинна масива: ", singArrayOneMonthData.length);
        }
        return singArrayOneMonthData;
    } catch (err) {
        console.error(err);
    }
}
