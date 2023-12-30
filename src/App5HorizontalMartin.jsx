import { useEffect, useState } from "react";
import { getOneMonthData1HourInterval } from "./utilsHorizontalMartin/apiHorizontalMartin";
import { scanData, tryToSee } from "./utilsHorizontalMartin/statsHorizontalMartin";

const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const tickers = [
    "BTC",
    "ETH",
    "SOL",
    "BNB",
    "XRP",
    "ADA",
    "AVAX",
    "DOGE",
    "DOT",
    "TRX",
    "MATIC",
    "UNI",
    "ATOM",
    "LTC",
    "LINK",
    "ETC",
    "CRO",
    "XLM",
    "XMR",
    "ALGO",
    "BCH",
    "FLOW",
    "VET",
    "FIL",
    "APE",
    "ICP",
];

const months = [
    { name: "November", days: 31, year: 2022 },
    { name: "December", days: 31, year: 2022 },
    { name: "January", days: 31, year: 2023 },
    { name: "February", days: 28, year: 2023 },
    { name: "March", days: 31, year: 2023 },
    { name: "April", days: 30, year: 2023 },
    { name: "May", days: 31, year: 2023 },
    { name: "June", days: 30, year: 2023 },
    { name: "July", days: 31, year: 2023 },
    { name: "August", days: 31, year: 2023 },
    { name: "September", days: 30, year: 2023 },
    { name: "October", days: 31, year: 2023 },
    { name: "November", days: 30, year: 2023 },
    // { name: "December", days: 29, year: 2023 },
];

function App5HorizontalMartin() {
    const [stats, setStats] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [dataCoin, setDataCoin] = useState("BTC");

    function calculateStatisticsHandler() {
        // console.log(tryToSee(dataCoin, singArrayTransformation));
    }

    function changeCoinHandler(e) {
        setDataCoin(e.target.value);
    }

    useEffect(() => {
        for (let i = 1; i < tickers.length; i++) {
            setTimeout(() => {
                setDataCoin(tickers[i]);
            }, 3000 * (i + 1));
        }
    }, []);

    useEffect(() => {
        async function tryThree() {
            const reqs = months.map((month) => getOneMonthData1HourInterval(dataCoin, month));
            const allPromises = Promise.all(reqs);
            try {
                const promiseResults = await allPromises;
                const oneMonthResult = promiseResults.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
                oneMonthResult.sort((a, b) => new Date(a.finishedTime) - new Date(b.finishedTime)); /* sort by days */
                const oneMonthDataWithOutcomes = tryToSee(dataCoin, oneMonthResult);
                const dataDividedByDays = chunkArray(oneMonthDataWithOutcomes.data, 24);
                setRenderData(dataDividedByDays);
                setStats((prevStats) => [...prevStats, ...oneMonthDataWithOutcomes.allStakes]);
            } catch (err) {
                console.error(err);
            }
        }

        tryThree();
    }, [dataCoin]);

    stats.length && console.log("STATS", stats);
    return (
        <>
            <div>
                <select name="" id="" value={dataCoin} onChange={changeCoinHandler}>
                    <option value=""></option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                    <option value="SOL">SOL</option>
                    <option value="BNB">BNB</option>
                    <option value="XRP">XRP</option>
                    <option value="ADA">ADA</option>
                    <option value="AVAX">AVAX</option>
                    <option value="DOGE">DOGE</option>
                    <option value="DOT">DOT</option>
                    <option value="TRX">TRX</option>
                    <option value="MATIC">MATIC</option>
                    <option value="UNI">UNI</option>
                    <option value="ATOM">ATOM</option>
                    <option value="LTC">LTC</option>
                    <option value="LINK">LINK</option>
                    <option value="ETC">ETC</option>
                    <option value="CRO">CRO</option>
                    <option value="XLM">XLM</option>
                    <option value="XMR">XMR</option>
                    <option value="ALGO">ALGO</option>
                    <option value="BCH">BCH</option>
                    <option value="FLOW">FLOW</option>
                    <option value="VET">VET</option>
                    <option value="FIL">FIL</option>
                    <option value="APE">APE</option>
                    <option value="ICP">ICP</option>
                </select>
            </div>
            <h2>Выбранная монета :{dataCoin}</h2>
            <p>
                <span>Выбранные месяцы {months.length}: </span>
                {months.map((month) => (
                    <span key={Math.floor(Math.random() * Date.now())}>{month.name}', '</span>
                ))}{" "}
            </p>
            <div className="statistics-operations">
                <button onClick={calculateStatisticsHandler}>Calculate Statistics</button>
            </div>
            <table>
                <tbody>
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

                    {renderData.length ? (
                        renderData.map((coinArr, index) => {
                            return (
                                <tr className="tr-data" key={Math.floor(Math.random() * Date.now())}>
                                    <td className="td-day__indicator">
                                        {coinArr[0]["finishedDay"]}.{coinArr[0]["month"]}
                                    </td>
                                    {coinArr.map((oneHourData, index) => (
                                        <td
                                            key={Math.floor(Math.random() * Date.now())}
                                            className={
                                                oneHourData.priceChangedFor1Hour.className +
                                                " box" +
                                                ` td${index + 1} ` +
                                                oneHourData?.outcome?.className
                                            }
                                            data-trend={oneHourData.priceChangedFor1Hour.className}
                                            data-value={oneHourData.priceChangedFor1Hour.value}
                                        >
                                            {oneHourData.priceChangedFor1Hour.value} {oneHourData?.outcome?.text}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td>LOADING.......</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default App5HorizontalMartin;
