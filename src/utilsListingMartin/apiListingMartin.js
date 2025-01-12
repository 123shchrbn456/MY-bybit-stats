import { calcPercentageDifference, chunkArray } from "../utils//helpers";

function fix5minSeasonChangeTimePart(monthName, data) {
    console.log("fix5minSeasonChangeTimePart", data);
    if (data.length === 0) return data;
    if (monthName === "October") {
        // Начиная с 7524 удалить 12 штук
        data.splice(7524, 12);
    }

    if (monthName === "March") {
        // Копировать данные за один час
        const copiedOneHourData = data.slice(8652, 8664);
        const newShit = JSON.parse(JSON.stringify(copiedOneHourData));
        const lastDayTime = copiedOneHourData[copiedOneHourData.length - 1].finishedTime.getTime();
        const TWENTY_FIVE_SEC = 25000;
        newShit.map((fiveMinnObj, index) => {
            const increasedIndex = index + 1;
            fiveMinnObj.finishedTime = new Date(lastDayTime + TWENTY_FIVE_SEC * increasedIndex);
            fiveMinnObj.finishedTime.setHours(2);
            fiveMinnObj.finishedHour = 2;
            fiveMinnObj.fakelyCreated = true;
            return fiveMinnObj;
        });
        data.splice(8664, 0, ...newShit);
    }
    return data;
}

// 5 минутный интервал -------------------------------------------------------------------------------------------------------------
async function get5MinutesSingleAPIRequest(url, monthName = "none", urlIntervalParam) {
    if (url === "none") return [];
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.result.list) {
            console.warn(data.retMsg, url);
        }

        // const coinsData = data; /* При использовании  Binance API */
        // console.log(data.result);

        const coinsData = data?.result?.list?.reverse(); /* При использовании  Bybit API */

        let newArr = coinsData.map((coinData) => ({
            finishedTime: new Date(Number(coinData[0])),
            finishedHour: new Date(Number(coinData[0])).getHours(),
            finishedMinutes: new Date(Number(coinData[0])).getMinutes(),
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
            // newCustomCoinObj.finishedTime = new Date(1679792400000);
            //
            newCustomCoinObj.finishedTime.setHours(3); /* ПЕРЕДЕЛАТЬ! */
            newCustomCoinObj.finishedHour = 3;
            newCustomCoinObj.fakelyCreated = true;
            newArr.splice(insertionIndex, 0, newCustomCoinObj); /* вставляем новый обьект */
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

export async function getOneMonthData5MinutesInterval(coin, month) {
    const dateStart1 = new Date(`${month.name} 01, ${month.year} 00:00:00`).getTime();
    const dateEnd1 = new Date(`${month.name} 03, ${month.year} 23:55:00`).getTime();

    const dateStart2 = new Date(`${month.name} 04, ${month.year} 00:00:00`).getTime();
    const dateEnd2 = new Date(`${month.name} 06, ${month.year} 23:55:00`).getTime();

    const dateStart3 = new Date(`${month.name} 07, ${month.year} 00:00:00`).getTime();
    const dateEnd3 = new Date(`${month.name} 09, ${month.year} 23:55:00`).getTime();

    const dateStart4 = new Date(`${month.name} 10, ${month.year} 00:00:00`).getTime();
    const dateEnd4 = new Date(`${month.name} 12, ${month.year} 23:55:00`).getTime();

    const dateStart5 = new Date(`${month.name} 13, ${month.year} 00:00:00`).getTime();
    const dateEnd5 = new Date(`${month.name} 15, ${month.year} 23:55:00`).getTime();

    const dateStart6 = new Date(`${month.name} 16, ${month.year} 00:00:00`).getTime();
    const dateEnd6 = new Date(`${month.name} 18, ${month.year} 23:55:00`).getTime();

    const dateStart7 = new Date(`${month.name} 19, ${month.year} 00:00:00`).getTime();
    const dateEnd7 = new Date(`${month.name} 21, ${month.year} 23:55:00`).getTime();

    const dateStart8 = new Date(`${month.name} 22, ${month.year} 00:00:00`).getTime();
    const dateEnd8 = new Date(`${month.name} 24, ${month.year} 23:55:00`).getTime();

    const dateStart9 = new Date(`${month.name} 25, ${month.year} 00:00:00`).getTime();
    const dateEnd9 = new Date(`${month.name} 27, ${month.year} 23:55:00`).getTime();

    const dateStart10 = new Date(`${month.name} 28, ${month.year} 00:00:00`).getTime();

    let dateEnd10, dateStart11, dateEnd11;

    if (month.days === 28) dateEnd10 = new Date(`${month.name} 28, ${month.year} 23:55:00`).getTime();
    if (month.days === 29) dateEnd10 = new Date(`${month.name} 29, ${month.year} 23:55:00`).getTime();
    if (month.days === 30) dateEnd10 = new Date(`${month.name} 30, ${month.year} 23:55:00`).getTime();
    if (month.days === 31) {
        dateEnd10 = new Date(`${month.name} 30, ${month.year} 23:55:00`).getTime();
        dateStart11 = new Date(`${month.name} 31, ${month.year} 00:00:00`).getTime();
        dateEnd11 = new Date(`${month.name} 31, ${month.year} 23:55:00`).getTime();
    }

    // const urlBinance1 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart1}&endTime=${dateEnd1}&limit=1500`;
    // const urlBinance2 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart2}&endTime=${dateEnd2}&limit=1500`;
    // const urlBinance3 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart3}&endTime=${dateEnd3}&limit=1500`;
    // const urlBinance4 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart4}&endTime=${dateEnd4}&limit=1500`;
    // const urlBinance5 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart5}&endTime=${dateEnd5}&limit=1500`;
    // const urlBinance6 = `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart6}&endTime=${dateEnd6}&limit=1500`;
    // const urlBinance31Day =
    //     month.days === 31
    //         ? `https://fapi.binance.com/fapi/v1/klines?symbol=${coin}USDT&interval=5m&startTime=${dateStart7}&endTime=${dateEnd7}&limit=1500`
    //         : "none";
    // Bybit ссылки
    const urlBybit1 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart1}&end=${dateEnd1}&limit=1000`;
    const urlBybit2 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart2}&end=${dateEnd2}&limit=1000`;
    const urlBybit3 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart3}&end=${dateEnd3}&limit=1000`;
    const urlBybit4 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart4}&end=${dateEnd4}&limit=1000`;
    const urlBybit5 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart5}&end=${dateEnd5}&limit=1000`;
    const urlBybit6 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart6}&end=${dateEnd6}&limit=1000`;
    const urlBybit7 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart7}&end=${dateEnd7}&limit=1000`;
    const urlBybit8 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart8}&end=${dateEnd8}&limit=1000`;
    const urlBybit9 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart9}&end=${dateEnd9}&limit=1000`;
    const urlBybit10 = `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart10}&end=${dateEnd10}&limit=1000`;
    const urlBybit31Day =
        month.days === 31
            ? `https://api.bybit.com/v5/market/kline?category=linear&symbol=${coin}USDT&interval=5&start=${dateStart11}&end=${dateEnd11}&limit=1000`
            : "none";
    const allPromises = Promise.all([
        get5MinutesSingleAPIRequest(urlBybit1, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit2, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit3, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit4, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit5, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit6, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit7, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit8, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit9, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit10, month.name, "5min"),
        get5MinutesSingleAPIRequest(urlBybit31Day, month.name, "5min"),
    ]);

    try {
        const promiseResult = await allPromises;

        // Изменить promiseResult[4] если месяц март или октябрь
        let singArrayOneMonthData = promiseResult.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
        // if (month.name === "March" || month.name === "October") {
        //     singArrayOneMonthData = fix5minSeasonChangeTimePart(month.name, singArrayOneMonthData);
        // }
        const ONE_DAY_ARRAY_LENGTH = 288;
        if (singArrayOneMonthData.length !== month.days * ONE_DAY_ARRAY_LENGTH && singArrayOneMonthData.length > 0) {
            /*  console.log(
                "Это месяц листинга или здесь не все данные",
                "Монета: ",
                coin,
                " .Месяц: ",
                month.name,
                " .Количество дней в месяце: ",
                month.days
            ); */
            // console.log("Монета: ", coin, " .Месяц: ", month.name, " .Количество дней в месяце: ", month.days);
            // console.log("Необходимая длинна масива: ", month.days * ONE_DAY_ARRAY_LENGTH);
            // console.log("Текущая длинна масива: ", singArrayOneMonthData.length);
        }
        return singArrayOneMonthData;
    } catch (err) {
        console.error(err);
    }
}
