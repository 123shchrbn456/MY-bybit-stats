import { useEffect, useState } from "react";
import { calcPercentageDifference } from "./utils/helpers";
import { calculateStatistic } from "./utils/statsUtils";
import { createOneMonthRequestLinks1HourInterval } from "./utils/apiUtils";

const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const months = [
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
    // { name: "December", days: 31 },
];

function App2() {
    const [renderData, setRenderData] = useState([]);
    const [dataCoin, setDataCoin] = useState("BTC");

    function calculateStatisticsHandler() {
        calculateStatistic();
    }

    function changeCoinHandler(e) {
        setDataCoin(e.target.value);
    }

    useEffect(() => {
        async function tryThree() {
            const reqs = months.map((month) => createOneMonthRequestLinks1HourInterval(dataCoin, month));
            const allPromises = Promise.all(reqs);
            try {
                const promiseResult = await allPromises;
                // console.log("promiseResult: ", promiseResult);
                let singArrayTransformation = promiseResult.reduce(
                    (accumulator, currentValue) => [...accumulator, ...currentValue],
                    []
                ); /* turn into one array */
                singArrayTransformation.sort((a, b) => new Date(a[0]["finishedTime"]) - new Date(b[0]["finishedTime"])); /* sort by days */
                // console.log(singArrayTransformation);
                // console.log("New request is ok");
                setRenderData(singArrayTransformation);
                setTimeout(() => {
                    console.log(calculateStatistic(dataCoin, "x50")());
                }, 500);
            } catch (err) {
                console.error(err);
            }
        }

        tryThree();
    }, [dataCoin]);

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
                    {/* <option value="ORDI">ORDI</option> */}
                </select>
            </div>
            <h2>Выбранная монета :{dataCoin}</h2>
            <p>
                <span>Выбранные месяцы {months.length}: </span>
                {months.map((month) => (
                    <span key={month.name}>{month.name}', '</span>
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
                                <tr key={index}>
                                    <td className="td-day__indicator">
                                        {coinArr[0]["finishedDay"]}.{coinArr[0]["month"]}
                                    </td>
                                    {coinArr.map((singleOrder, index) => (
                                        <td
                                            key={index}
                                            className={singleOrder.priceChangedFor1Hour.className + " box" + ` td${index + 1}`}
                                            data-trend={singleOrder.priceChangedFor1Hour.className}
                                            data-value={singleOrder.priceChangedFor1Hour.value}
                                        >
                                            {singleOrder.priceChangedFor1Hour.value}
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

export default App2;
