import React from "react";
import { useEffect, useState } from "react";
import { calcPercentageDifference } from "./utils/helpers";

const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const TableOrdi3Months = () => {
    const [coins, setCoins] = useState([]);

    const COIN = "ORDI";

    const MONTH7 = "July";
    const MONTH8 = "August";
    const MONTH9 = "September";

    const dateStartJul = new Date(`${MONTH7} 01, 2023 00:00:00`).getTime();
    const dateEndJul = new Date(`${MONTH7} 08, 2023 23:00:00`).getTime();
    const dateStart2Jul = new Date(`${MONTH7} 09, 2023 00:00:00`).getTime();
    const dateEnd2Jul = new Date(`${MONTH7} 16, 2023 23:00:00`).getTime();
    const dateStart3Jul = new Date(`${MONTH7} 17, 2023 00:00:00`).getTime();
    const dateEnd3Jul = new Date(`${MONTH7} 24, 2023 23:00:00`).getTime();
    const dateStart4Jul = new Date(`${MONTH7} 25, 2023 00:00:00`).getTime();
    const dateEnd4Jul = new Date(`${MONTH7} 31, 2023 23:00:00`).getTime();

    const urlNewJul = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStartJul}&end=${dateEndJul}`;
    const urlNew2Jul = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart2Jul}&end=${dateEnd2Jul}`;
    const urlNew3Jul = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart3Jul}&end=${dateEnd3Jul}`;
    const urlNew4Jul = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart4Jul}&end=${dateEnd4Jul}`;

    const dateStartOct = new Date(`${MONTH8} 01, 2023 00:00:00`).getTime();
    const dateEndOct = new Date(`${MONTH8} 08, 2023 23:00:00`).getTime();
    const dateStart2Oct = new Date(`${MONTH8} 09, 2023 00:00:00`).getTime();
    const dateEnd2Oct = new Date(`${MONTH8} 16, 2023 23:00:00`).getTime();
    const dateStart3Oct = new Date(`${MONTH8} 17, 2023 00:00:00`).getTime();
    const dateEnd3Oct = new Date(`${MONTH8} 24, 2023 23:00:00`).getTime();
    const dateStart4Oct = new Date(`${MONTH8} 25, 2023 00:00:00`).getTime();
    const dateEnd4Oct = new Date(`${MONTH8} 31, 2023 23:00:00`).getTime();

    const urlNewOct = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStartOct}&end=${dateEndOct}`;
    const urlNew2Oct = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart2Oct}&end=${dateEnd2Oct}`;
    const urlNew3Oct = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart3Oct}&end=${dateEnd3Oct}`;
    const urlNew4Oct = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart4Oct}&end=${dateEnd4Oct}`;

    const dateStartNov = new Date(`${MONTH9} 01, 2023 00:00:00`).getTime();
    const dateEndNov = new Date(`${MONTH9} 08, 2023 23:00:00`).getTime();
    const dateStart2Nov = new Date(`${MONTH9} 09, 2023 00:00:00`).getTime();
    const dateEnd2Nov = new Date(`${MONTH9} 16, 2023 23:00:00`).getTime();
    const dateStart3Nov = new Date(`${MONTH9} 17, 2023 00:00:00`).getTime();
    const dateEnd3Nov = new Date(`${MONTH9} 24, 2023 23:00:00`).getTime();
    const dateStart4Nov = new Date(`${MONTH9} 25, 2023 00:00:00`).getTime();
    const dateEnd4Nov = new Date(`${MONTH9} 30, 2023 23:00:00`).getTime();

    const urlNewNov = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStartNov}&end=${dateEndNov}`;
    const urlNew2Nov = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart2Nov}&end=${dateEnd2Nov}`;
    const urlNew3Nov = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart3Nov}&end=${dateEnd3Nov}`;
    const urlNew4Nov = `https://api.bybit.com/derivatives/v3/public/kline?category=linear&symbol=${COIN}USDT&interval=60&start=${dateStart4Nov}&end=${dateEnd4Nov}`;

    useEffect(() => {
        async function getSingleAPIRequest(url) {
            try {
                const response = await fetch(url);
                const data = await response.json();
                const coinsData = data.result.list.reverse();

                const newArr = coinsData.map((coinData) => ({
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
                // console.log(newArr);
                const chunks = chunkArray(newArr, 24); /* для реквестов &interval=60*/
                // const chunks = chunkArray(newArr, 6);/* для реквестов &interval=240*/
                return chunks;
            } catch (error) {
                console.error(error);
            }
        }

        async function getMultipleRequests() {
            const [firstJul, secondJul, thirdJul, fourthJul] = await Promise.all([
                getSingleAPIRequest(urlNewJul),
                getSingleAPIRequest(urlNew2Jul),
                getSingleAPIRequest(urlNew3Jul),
                getSingleAPIRequest(urlNew4Jul),
            ]);
            const [firstOct, secondOct, thirdOct, fourthOct] = await Promise.all([
                getSingleAPIRequest(urlNewOct),
                getSingleAPIRequest(urlNew2Oct),
                getSingleAPIRequest(urlNew3Oct),
                getSingleAPIRequest(urlNew4Oct),
            ]);
            const [first, second, third, fourth] = await Promise.all([
                getSingleAPIRequest(urlNewNov),
                getSingleAPIRequest(urlNew2Nov),
                getSingleAPIRequest(urlNew3Nov),
                getSingleAPIRequest(urlNew4Nov),
            ]);
            const mergedData = [
                ...firstJul,
                ...secondJul,
                ...thirdJul,
                ...fourthJul,
                ...firstOct,
                ...secondOct,
                ...thirdOct,
                ...fourthOct,
                ...first,
                ...second,
                ...third,
                ...fourth,
            ];
            mergedData.sort((a, b) => new Date(a[0]["finishedTime"]) - new Date(b[0]["finishedTime"])); /* sort by days */
            console.log(mergedData);
            setCoins(mergedData);
        }
        getMultipleRequests();
    }, []);

    return (
        <>
            <h2>{COIN}</h2>
            <h3>
                {MONTH7} {MONTH8} {MONTH9}
            </h3>
            <table>
                <tr>
                    <th>Day/Hours</th>
                    <th>00:00</th>
                    <th>01:00</th>
                    <th>02:00</th>
                    <th>03:00</th>
                    <th>04:00</th>
                    <th>05:00</th>
                    <th>06:00</th>
                    <th>07:00</th>
                    <th>08:00</th>
                    <th>09:00</th>
                    <th>10:00</th>
                    <th>11:00</th>
                    <th>12:00</th>
                    <th>13:00</th>
                    <th>14:00</th>
                    <th>15:00</th>
                    <th>16:00</th>
                    <th>17:00</th>
                    <th>18:00</th>
                    <th>19:00</th>
                    <th>20:00</th>
                    <th>21:00</th>
                    <th>22:00</th>
                    <th>23:00</th>
                </tr>
                {/* <tr>
                <td>20.12.</td>
                <td>1.22</td>
                <td>3.25</td>
            </tr> */}

                {coins.map((coinArr, index) => {
                    // console.log(coinArr[0]["finishedDay"]);
                    return (
                        <tr key={index}>
                            <td>
                                {coinArr[0]["finishedDay"]}.{coinArr[0]["month"]}
                            </td>
                            {coinArr.map((singleOrder, index) => (
                                <td
                                    key={index}
                                    className={singleOrder.priceChangedFor1Hour.className + ` td${index + 1}`}
                                    data-trend={singleOrder.priceChangedFor1Hour.className}
                                    data-value={singleOrder.priceChangedFor1Hour.value}
                                >
                                    {singleOrder.priceChangedFor1Hour.value}
                                </td>
                            ))}
                        </tr>
                    );
                })}

                {/* <tr>
                <td>Centro comercial Moctezuma</td>
                <td>Francisco Chang</td>
                <td>Mexico</td>
            </tr> */}
            </table>
        </>
    );
};

export default TableOrdi3Months;
