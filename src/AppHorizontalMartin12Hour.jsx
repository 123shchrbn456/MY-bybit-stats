import { useEffect, useState } from "react";
import { getOneMonthData1HourInterval } from "./utilsHorizontalMartin12Hours/api12HoursHorizontalMartin";
import { tryToSee12HoursHorizontal } from "./utilsHorizontalMartin12Hours/stats12HoursHorizontalMartin";
import { tickersNovember2021ToNovember2023 } from "./utils/helpers";
const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const months = [
    { name: "October", days: 30, year: 2021 },
    { name: "November", days: 30, year: 2021 },
    { name: "December", days: 31, year: 2021 },
    { name: "January", days: 31, year: 2022 },
    { name: "February", days: 28, year: 2022 },
    { name: "March", days: 31, year: 2022 },
    { name: "April", days: 30, year: 2022 },
    { name: "May", days: 31, year: 2022 },
    { name: "June", days: 30, year: 2022 },
    { name: "July", days: 31, year: 2022 },
    { name: "August", days: 31, year: 2022 },
    { name: "September", days: 30, year: 2022 },
    { name: "October", days: 31, year: 2022 },
    { name: "November", days: 30, year: 2022 },
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
    { name: "December", days: 31, year: 2022 },
    { name: "January", days: 31, year: 2024 },
    { name: "February", days: 28, year: 2024 },
    { name: "March", days: 31, year: 2024 },
    { name: "April", days: 30, year: 2024 },
    { name: "May", days: 31, year: 2024 },
    { name: "June", days: 30, year: 2024 },
    { name: "July", days: 31, year: 2024 },
    { name: "August", days: 31, year: 2024 },
    { name: "September", days: 30, year: 2024 },
    { name: "October", days: 31, year: 2024 },
];

function App5HorizontalMartin() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [coinName, setCoinName] = useState("BTC");

    function calculateStatisticsHandler() {
        // console.log(tryToSee(coinName, singArrayTransformation));
    }

    function changeCoinHandler(e) {
        setCoinName(e.target.value);
    }

    useEffect(() => {
        // Автоматическое переключение монет
        // for (let i = 1; i < tickersNovember2021ToNovember2023.length; i++) {
        //     setTimeout(() => {
        //         setCoinName(tickersNovember2021ToNovember2023[i]);
        //     }, 31000 * (i + 1));
        // }
    }, []);

    useEffect(() => {
        // async function tryThree() {
        //     const reqs = months.map((month) => getOneMonthData1HourInterval(coinName, month));
        //     const allPromises = Promise.all(reqs);
        //     try {
        //         const promiseResults = await allPromises;
        //         const allMonthsResult = promiseResults.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
        //         allMonthsResult.sort((a, b) => new Date(a.finishedTime) - new Date(b.finishedTime)); /* sort by days */
        //         const oneMonthDataWithOutcomes = tryToSee(coinName, allMonthsResult);
        //         const dataDividedByDays = chunkArray(oneMonthDataWithOutcomes.data, 24);
        //         setRenderData(dataDividedByDays);
        //         setStats((prevStats) => {
        //             const nextStats = [...prevStats, ...oneMonthDataWithOutcomes.allStakes];
        //             nextStats.sort((a, b) => new Date(a.time) - new Date(b.time));
        //             return nextStats;
        //         });
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }

        async function getDataWithDelays() {
            setLoading(true);
            let delay = 0;
            const delayIncrement = 100;
            // забирает 25 секунд
            const reqs = months.map((month) => {
                delay += delayIncrement;
                return new Promise((resolve) => setTimeout(resolve, delay)).then(() => getOneMonthData1HourInterval(coinName, month));
            });
            const allPromises = Promise.all(reqs);
            try {
                const promiseResults = await allPromises;
                const allMonthsResult = promiseResults.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
                allMonthsResult.sort((a, b) => new Date(a.finishedTime) - new Date(b.finishedTime)); /* sort by days */
                // console.log("allMonthsResult", allMonthsResult);
                const oneMonthDataWithOutcomes = tryToSee12HoursHorizontal(coinName, allMonthsResult);
                // console.log("oneMonthDataWithOutcomes", oneMonthDataWithOutcomes);
                const dataDividedByDays = chunkArray(oneMonthDataWithOutcomes.data, 24);
                // console.log("dataDividedByDays", dataDividedByDays);
                setRenderData(dataDividedByDays);
                setStats((prevStats) => {
                    const nextStats = [...prevStats, ...oneMonthDataWithOutcomes.allStakes];
                    nextStats.sort((a, b) => new Date(a.time) - new Date(b.time));
                    return nextStats;
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }

        getDataWithDelays();
    }, [coinName]);

    stats.length && console.log("STATS", stats);
    return (
        <>
            <div>
                <select name="" id="" value={coinName} onChange={changeCoinHandler}>
                    <option value=""></option>
                    {tickersNovember2021ToNovember2023.map((ticker) => (
                        <option key={Math.floor(Math.random() * Date.now())} value={ticker}>
                            {ticker}
                        </option>
                    ))}
                </select>
            </div>
            <h2>Выбранная монета :{coinName}</h2>
            <p>
                <span>Выбранные месяцы {months.length}: </span>
                {months.map((month) => (
                    <span key={Math.floor(Math.random() * Date.now())}>{month.name}', '</span>
                ))}{" "}
            </p>
            <div className="statistics-operations">
                <button onClick={calculateStatisticsHandler}>Calculate Statistics</button>
                <button onClick={() => setAutomatic(true)}>Start Automatic</button>
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

                    {!loading ? (
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
