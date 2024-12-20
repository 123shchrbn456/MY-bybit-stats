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
    return { className: className, value: result.toFixed(4) };
}

const tickersJune2020ToNovember2023 = [
    "BTC",
    "BNB",
    "ETH",
    "BCH",
    "XRP",
    "EOS",
    "LTC",
    "TRX",
    "ETC",
    "LINK",
    "XLM",
    "ADA",
    "XMR",
    "DASH",
    "ZEC",
    "XTZ",
    "ATOM",
    "ONT",
    "IOTA",
    "BAT",
    "VET",
    "NEO",
    "QTUM",
    "IOST",
    "THETA",
    // 117минут
];

export const tickersNovember2021ToNovember2023 = [
    "BTC",
    "BNB",
    "ETH",
    "BCH",
    "XRP",
    "EOS",
    "LTC",
    "TRX",
    "ETC",
    "LINK",
    "XLM",
    "ADA",
    "XMR",
    "DASH",
    "ZEC",
    "XTZ",
    "ATOM",
    "ONT",
    "IOTA",
    "BAT",
    "VET",
    "NEO",
    "QTUM",
    "IOST",
    "THETA",
    "ALGO",
    "ZIL",
    "KNC",
    "ZRX",
    "COMP",
    "OMG",
    "DOGE",
    "SXP",
    "KAVA",
    "BAND",
    "RLC",
    "WAVES",
    "MKR",
    "SNX",
    "DOT",
    "YFI",
    "BAL",
    "CRV",
    "TRB",
    "RUNE",
    "SUSHI",
    "EGLD",
    "SOL",
    "ICX",
    "STORJ",
    "BLZ",
    "UNI",
    "AVAX",
    "FTM",
    "ENJ",
    "FLM",
    "REN",
    "KSM",
    "NEAR",
    "AAVE",
    "FIL",
    "RSR",
    "LRC",
    "MATIC",
    "OCEAN",
    "BEL",
    "CTK",
    "AXS",
    "ALPHA",
    "ZEN",
    "SKL",
    "GRT",
    "1INCH",
    "CHZ",
    "LIT",
    "RVN",
    "XEM",
    "SFP",
    "CHR",
    "ONE",
    "HOT",
    "MTL",
    "OGN",
    "NKN",
    "DGB",
    "GTC",
    "C98",
    "ATA",
    "SAND",
    "ANKR",
    "UNFI",
    "REEF",
    "COTI",
    "MANA",
    "HBAR",
    "LINA",
    "STMX",
    "DENT",
    "CELR",
    "ALICE",
    "AR",
    "AUDIO",
    "1000SHIB",
    "BAKE",
    "IOTX",
    "MASK",
    "DYDX",
    "1000XEC",
    "GALA",
    "CELO",
    "KLAY",
    "ARPA",
    "CTSI",
    // 117минут
];

export const tickersNovember2022ToNovember2023 = [
    "BTC",
    "BNB",
    "ETH",
    "BCH",
    "XRP",
    "EOS",
    "LTC",
    "TRX",
    "ETC",
    "LINK",
    "XLM",
    "ADA",
    "XMR",
    "DASH",
    "ZEC",
    "XTZ",
    "ATOM",
    "ONT",
    "IOTA",
    "BAT",
    "VET",
    "NEO",
    "QTUM",
    "IOST",
    "THETA",
    "ALGO",
    "ZIL",
    "KNC",
    "ZRX",
    "COMP",
    "OMG",
    "DOGE",
    "SXP",
    "KAVA",
    "BAND",
    "RLC",
    "WAVES",
    "MKR",
    "SNX",
    "DOT",
    "YFI",
    "BAL",
    "CRV",
    "TRB",
    "RUNE",
    "SUSHI",
    "EGLD",
    "SOL",
    "ICX",
    "STORJ",
    "BLZ",
    "UNI",
    "AVAX",
    "FTM",
    "ENJ",
    "FLM",
    "REN",
    "KSM",
    "NEAR",
    "AAVE",
    "FIL",
    "RSR",
    "LRC",
    "MATIC",
    "OCEAN",
    "BEL",
    "CTK",
    "AXS",
    "ALPHA",
    "ZEN",
    "SKL",
    "GRT",
    "1INCH",
    "CHZ",
    "LIT",
    "RVN",
    "XEM",
    "SFP",
    "CHR",
    "ONE",
    "HOT",
    "MTL",
    "OGN",
    "NKN",
    "DGB",
    "GTC",
    "C98",
    "ATA",
    "LPT",
    "ENS",
    "ANT",
    "IMX",
    "GMT",
    "APE",
    "WOO",
    "DAR",
    "GAL",
    "INJ",
    "STG",
    "LDO",
    "CVX",
    "ICP",
    "APT",
    "QNT",
    "SAND",
    "ANKR",
    "UNFI",
    "REEF",
    "COTI",
    "MANA",
    "HBAR",
    "LINA",
    "STMX",
    "DENT",
    "CELR",
    "ALICE",
    "AR",
    "AUDIO",
    "1000SHIB",
    "BAKE",
    "IOTX",
    "MASK",
    "DYDX",
    "1000XEC",
    "GALA",
    "CELO",
    "KLAY",
    "ARPA",
    "KLAY",
    "ARPA",
    "CTSI",
    "PEOPLE",
    "ROSE",
    "DUSK",
    "FLOW",
    "API3",
    "JASMY",
    "OP",
    "SPELL",
    "1000LUNC",
    "LUNA2",
];

const dateStart4 = new Date(`November 1, 2023 00:00:00`).getTime();
const dateEnd4 = new Date(`November 30, 2023 23:00:00`).getTime();
const url8 = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=BTCUSDT&interval=60&start=1700863200000&end=1700946000000`;
const url9 = `https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&startTime=1700863200000&endTime=1700946000000`;
