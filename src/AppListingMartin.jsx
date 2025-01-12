import React from "react";
import { useEffect, useState } from "react";
import { tickersNovember2021ToNovember2023, ALL_LISTING_TICKERS, UPDATED_FUTURES_TICKERS } from "./utils/helpers";
import { getOneMonthData5MinutesInterval } from "./utilsListingMartin/apiListingMartin";
import { tryToSee5MinutesHorizontal } from "./utilsListingMartin/statsListingMartin";

const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const months = [
    // { name: "November", days: 30, year: 2021 },
    // { name: "December", days: 31, year: 2021 },
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
    { name: "December", days: 31, year: 2023 },
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
    { name: "November", days: 30, year: 2024 },
    { name: "December", days: 31, year: 2024 },
    { name: "January", days: 31, year: 2025 },
];

function AppListingMartin() {
    const [loading, setLoading] = useState(true);
    // const [stats, setStats] = useState([]);
    // const [renderData, setRenderData] = useState([]);
    // const [coinName, setCoinName] = useState("10000000AIDOGE");
    const [coinName, setCoinName] = useState("FLOCK");
    // const [coinName, setCoinName] = useState("XTER");

    function changeCoinHandler(e) {
        setCoinName(e.target.value);
    }

    useEffect(() => {
        // Автоматическое переключение монет
        // for (let i = 1; i < UPDATED_FUTURES_TICKERS.length; i++) {
        //     setTimeout(() => {
        //         setCoinName(UPDATED_FUTURES_TICKERS[i]);
        //     }, 25000 * (i + 1));
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
        // setBetCountingIsStarted(true);
        async function getDataWithDelays() {
            setLoading(true);
            let delay = 0;
            const delayIncrement = 100;
            // забирает 25 секунд
            const reqs = months.map((month) => {
                delay += delayIncrement;
                return new Promise((resolve) => setTimeout(resolve, delay)).then(() => getOneMonthData5MinutesInterval(coinName, month));
            });
            const allPromises = Promise.all(reqs);

            try {
                const promiseResults = await allPromises;
                const allMonthsResult = promiseResults.reduce((accumulator, currentValue) => [...accumulator, ...currentValue], []);
                allMonthsResult.sort((a, b) => new Date(a.finishedTime) - new Date(b.finishedTime)); /* sort by days */
                const withoutFirstFiveMinutesObj = allMonthsResult.slice(1);
                // console.log("withoutFirstFiveMinutesObj", withoutFirstFiveMinutesObj);
                const oneMonthDataWithOutcomes = tryToSee5MinutesHorizontal(coinName, withoutFirstFiveMinutesObj);

                // const dataDividedByDays = chunkArray(oneMonthDataWithOutcomes.data, 288);

                // setRenderData(dataDividedByDays);
                // setStats((prevStats) => {
                //     const nextStats = [...prevStats, ...oneMonthDataWithOutcomes.allStakes];
                //     nextStats.sort((a, b) => new Date(a.time) - new Date(b.time));
                //     return nextStats;
                // });
                setLoading(false);
            } catch (err) {
                console.error(err);
            }
        }

        getDataWithDelays();
    }, [coinName]);

    // stats.length && console.log("STATS", stats);
    return (
        <>
            <div>
                <select name="" id="" value={coinName} onChange={changeCoinHandler}>
                    <option value=""></option>
                    {UPDATED_FUTURES_TICKERS.map((ticker) => (
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
                {/* <button onClick={calculateStatisticsHandler}>Calculate Statistics</button> */}
                <button onClick={() => setAutomatic(true)}>Start Automatic</button>
            </div>
            <table>
                <tbody>
                    <tr>
                        <th>Day/Hours</th>
                        <th>00:00</th>
                        <th>00:05</th>
                        <th>00:10</th>
                        <th>00:15</th>
                        <th>00:20</th>
                        <th>00:25</th>
                        <th>00:30</th>
                        <th>00:35</th>
                        <th>00:40</th>
                        <th>00:45</th>
                        <th>00:50</th>
                        <th>00:55</th>

                        <th>01:00</th>
                        <th>01:05</th>
                        <th>01:10</th>
                        <th>01:15</th>
                        <th>01:20</th>
                        <th>01:25</th>
                        <th>01:30</th>
                        <th>01:35</th>
                        <th>01:40</th>
                        <th>01:45</th>
                        <th>01:50</th>
                        <th>01:55</th>

                        <th>02:00</th>
                        <th>02:05</th>
                        <th>02:10</th>
                        <th>02:15</th>
                        <th>02:20</th>
                        <th>02:25</th>
                        <th>02:30</th>
                        <th>02:35</th>
                        <th>02:40</th>
                        <th>02:45</th>
                        <th>02:50</th>
                        <th>02:55</th>

                        <th>03:00</th>
                        <th>03:05</th>
                        <th>03:10</th>
                        <th>03:15</th>
                        <th>03:20</th>
                        <th>03:25</th>
                        <th>03:30</th>
                        <th>03:35</th>
                        <th>03:40</th>
                        <th>03:45</th>
                        <th>03:50</th>
                        <th>03:55</th>

                        <th>04:00</th>
                        <th>04:05</th>
                        <th>04:10</th>
                        <th>04:15</th>
                        <th>04:20</th>
                        <th>04:25</th>
                        <th>04:30</th>
                        <th>04:35</th>
                        <th>04:40</th>
                        <th>04:45</th>
                        <th>04:50</th>
                        <th>04:55</th>

                        <th>05:00</th>
                        <th>05:05</th>
                        <th>05:10</th>
                        <th>05:15</th>
                        <th>05:20</th>
                        <th>05:25</th>
                        <th>05:30</th>
                        <th>05:35</th>
                        <th>05:40</th>
                        <th>05:45</th>
                        <th>05:50</th>
                        <th>05:55</th>

                        <th>06:00</th>
                        <th>06:05</th>
                        <th>06:10</th>
                        <th>06:15</th>
                        <th>06:20</th>
                        <th>06:25</th>
                        <th>06:30</th>
                        <th>06:35</th>
                        <th>06:40</th>
                        <th>06:45</th>
                        <th>06:50</th>
                        <th>06:55</th>

                        <th>07:00</th>
                        <th>07:05</th>
                        <th>07:10</th>
                        <th>07:15</th>
                        <th>07:20</th>
                        <th>07:25</th>
                        <th>07:30</th>
                        <th>07:35</th>
                        <th>07:40</th>
                        <th>07:45</th>
                        <th>07:50</th>
                        <th>07:55</th>

                        <th>08:00</th>
                        <th>08:05</th>
                        <th>08:10</th>
                        <th>08:15</th>
                        <th>08:20</th>
                        <th>08:25</th>
                        <th>08:30</th>
                        <th>08:35</th>
                        <th>08:40</th>
                        <th>08:45</th>
                        <th>08:50</th>
                        <th>08:55</th>

                        <th>09:00</th>
                        <th>09:05</th>
                        <th>09:10</th>
                        <th>09:15</th>
                        <th>09:20</th>
                        <th>09:25</th>
                        <th>09:30</th>
                        <th>09:35</th>
                        <th>09:40</th>
                        <th>09:45</th>
                        <th>09:50</th>
                        <th>09:55</th>

                        <th>10:00</th>
                        <th>10:05</th>
                        <th>10:10</th>
                        <th>10:15</th>
                        <th>10:20</th>
                        <th>10:25</th>
                        <th>10:30</th>
                        <th>10:35</th>
                        <th>10:40</th>
                        <th>10:45</th>
                        <th>10:50</th>
                        <th>10:55</th>

                        <th>11:00</th>
                        <th>11:05</th>
                        <th>11:10</th>
                        <th>11:15</th>
                        <th>11:20</th>
                        <th>11:25</th>
                        <th>11:30</th>
                        <th>11:35</th>
                        <th>11:40</th>
                        <th>11:45</th>
                        <th>11:50</th>
                        <th>11:55</th>

                        <th>12:00</th>
                        <th>12:05</th>
                        <th>12:10</th>
                        <th>12:15</th>
                        <th>12:20</th>
                        <th>12:25</th>
                        <th>12:30</th>
                        <th>12:35</th>
                        <th>12:40</th>
                        <th>12:45</th>
                        <th>12:50</th>
                        <th>12:55</th>

                        <th>13:00</th>
                        <th>13:05</th>
                        <th>13:10</th>
                        <th>13:15</th>
                        <th>13:20</th>
                        <th>13:25</th>
                        <th>13:30</th>
                        <th>13:35</th>
                        <th>13:40</th>
                        <th>13:45</th>
                        <th>13:50</th>
                        <th>13:55</th>

                        <th>14:00</th>
                        <th>14:05</th>
                        <th>14:10</th>
                        <th>14:15</th>
                        <th>14:20</th>
                        <th>14:25</th>
                        <th>14:30</th>
                        <th>14:35</th>
                        <th>14:40</th>
                        <th>14:45</th>
                        <th>14:50</th>
                        <th>14:55</th>

                        <th>15:00</th>
                        <th>15:05</th>
                        <th>15:10</th>
                        <th>15:15</th>
                        <th>15:20</th>
                        <th>15:25</th>
                        <th>15:30</th>
                        <th>15:35</th>
                        <th>15:40</th>
                        <th>15:45</th>
                        <th>15:50</th>
                        <th>15:55</th>

                        <th>16:00</th>
                        <th>16:05</th>
                        <th>16:10</th>
                        <th>16:15</th>
                        <th>16:20</th>
                        <th>16:25</th>
                        <th>16:30</th>
                        <th>16:35</th>
                        <th>16:40</th>
                        <th>16:45</th>
                        <th>16:50</th>
                        <th>16:55</th>

                        <th>17:00</th>
                        <th>17:05</th>
                        <th>17:10</th>
                        <th>17:15</th>
                        <th>17:20</th>
                        <th>17:25</th>
                        <th>17:30</th>
                        <th>17:35</th>
                        <th>17:40</th>
                        <th>17:45</th>
                        <th>17:50</th>
                        <th>17:55</th>

                        <th>18:00</th>
                        <th>18:05</th>
                        <th>18:10</th>
                        <th>18:15</th>
                        <th>18:20</th>
                        <th>18:25</th>
                        <th>18:30</th>
                        <th>18:35</th>
                        <th>18:40</th>
                        <th>18:45</th>
                        <th>18:50</th>
                        <th>18:55</th>

                        <th>19:00</th>
                        <th>19:05</th>
                        <th>19:10</th>
                        <th>19:15</th>
                        <th>19:20</th>
                        <th>19:25</th>
                        <th>19:30</th>
                        <th>19:35</th>
                        <th>19:40</th>
                        <th>19:45</th>
                        <th>19:50</th>
                        <th>19:55</th>

                        <th>20:00</th>
                        <th>20:05</th>
                        <th>20:10</th>
                        <th>20:15</th>
                        <th>20:20</th>
                        <th>20:25</th>
                        <th>20:30</th>
                        <th>20:35</th>
                        <th>20:40</th>
                        <th>20:45</th>
                        <th>20:50</th>
                        <th>20:55</th>

                        <th>21:00</th>
                        <th>21:05</th>
                        <th>21:10</th>
                        <th>21:15</th>
                        <th>21:20</th>
                        <th>21:25</th>
                        <th>21:30</th>
                        <th>21:35</th>
                        <th>21:40</th>
                        <th>21:45</th>
                        <th>21:50</th>
                        <th>21:55</th>

                        <th>22:00</th>
                        <th>22:05</th>
                        <th>22:10</th>
                        <th>22:15</th>
                        <th>22:20</th>
                        <th>22:25</th>
                        <th>22:30</th>
                        <th>22:35</th>
                        <th>22:40</th>
                        <th>22:45</th>
                        <th>22:50</th>
                        <th>22:55</th>

                        <th>23:00</th>
                        <th>23:05</th>
                        <th>23:10</th>
                        <th>23:15</th>
                        <th>23:20</th>
                        <th>23:25</th>
                        <th>23:30</th>
                        <th>23:35</th>
                        <th>23:40</th>
                        <th>23:45</th>
                        <th>23:50</th>
                        <th>23:55</th>
                    </tr>

                    {/* {!loading ? (
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
                    )} */}
                </tbody>
            </table>
        </>
    );
}

export default AppListingMartin;
