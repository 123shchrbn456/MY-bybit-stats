import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import App2 from "./App2.jsx";
import App4HoursTable from "./App4HoursTable.jsx";
import App5HorizontalMartin from "./App5HorizontalMartin.jsx";
import AppHorizontalMartin12Hour from "./AppHorizontalMartin12Hour.jsx";
import AppHorizontalMartin5Minutes from "./AppHorizontalMartin5Minutes.jsx";
import AppConsecutiveMartin5Minutes from "./AppConsecutiveMartin5Minutes.jsx";
import AppListingMartin from "./AppListingMartin.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* <App2 /> */}
        {/* <App4HoursTable /> */}
        {/* <App4HoursTable /> */}
        {/* <App5HorizontalMartin /> */}
        {/* <AppHorizontalMartin12Hour /> */}
        {/* <AppHorizontalMartin5Minutes /> */}
        {/* <AppConsecutiveMartin5Minutes /> */}
        <AppListingMartin />
    </React.StrictMode>
);

/* 
План
1- Протестировать догоны с ростом в 50%
2-Расчитывать только на первый квадрат, если не проходит, то ликвидировать
[x]-Внедрить инпут изменение монеты из UI, возможно через реф
[]-Сделать измениение величины плеча из  UI, возможно через реф
[]-Сделать измениение количества итераций из  UI, возможно через реф

[x]-Сделать не только подбивку статистики в противовес(лонг-шорт, шорт-лонг), НО и (шорт-шорт,лонг-лонг)

[]-Сделать таблицу с 4 часовым масштабом



[]-В самом конце в общий массив поместить выиграши и проигрыши, отсортировать по времени, посмотреть что за тенденции на догон
*/
