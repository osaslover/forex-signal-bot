require("dotenv").config();

const express = require("express");

const TelegramBot =
    require("node-telegram-bot-api");

const { analyzeMarket } =
    require("./strategy");


const app = express();


const PORT =
    process.env.PORT || 3000;


/*
=============================
TELEGRAM
=============================
*/

const bot = new TelegramBot(

    process.env.TELEGRAM_TOKEN,

    {
        polling: true
    }

);


const CHAT_ID =
    process.env.TELEGRAM_CHAT_ID;


/*
=============================
HEALTH CHECK
=============================
*/

app.get("/", (req, res) => {

    res.send(
        "🤖 Smart Signal Bot Running"
    );

});


app.get("/health", (req, res) => {

    res.json({

        status: "online",

        bot: "Smart Signal Bot"

    });

});


/*
=============================
SIGNAL FUNCTION
=============================
*/

async function sendSignal(
    asset,
    timeframe,
    analysis
) {

    if (
        analysis.decision === "NO TRADE"
    ) {

        return;

    }


    const emoji =
        analysis.decision === "UP"
            ? "🟢"
            : "🔴";


    const message = `

🤖 SMART SIGNAL

📊 Asset: ${asset}

${emoji} Direction: ${analysis.decision}

⏱️ Timeframe: ${timeframe}

🎯 Confidence: ${analysis.confidence}%

💰 Price: ${analysis.price}

📈 EMA 9: ${analysis.ema9}

📊 EMA 21: ${analysis.ema21}

⚡ RSI: ${analysis.rsi.toFixed(2)}

🧠 Analysis:

${analysis.reasons
    .map(reason => `• ${reason}`)
    .join("\n")}

⚠️ This is a probability-based analysis.
No trading signal is guaranteed.

`;


    try {

        await bot.sendMessage(

            CHAT_ID,

            message

        );

        console.log(
            "Signal sent:",
            asset,
            analysis.decision
        );

    } catch (error) {

        console.error(
            "Telegram error:",
            error.message
        );

    }

}


/*
=============================
MULTI TIMEFRAME ANALYSIS
=============================
*/

async function scanAsset(asset) {

    console.log(
        "Scanning:",
        asset
    );


    /*
    Later this function will receive
    REAL candle data.
    */

    const candles1m =
        await getMarketData(
            asset,
            "1m"
        );

    const candles5m =
        await getMarketData(
            asset,
            "5m"
        );

    const candles15m =
        await getMarketData(
            asset,
            "15m"
        );


    const analysis1m =
        analyzeMarket(candles1m);

    const analysis5m =
        analyzeMarket(candles5m);

    const analysis15m =
        analyzeMarket(candles15m);


    const analyses = [

        {
            timeframe: "1 Minute",
            data: analysis1m
        },

        {
            timeframe: "5 Minutes",
            data: analysis5m
        },

        {
            timeframe: "15 Minutes",
            data: analysis15m
        }

    ];


    /*
    =========================
    FIND BEST TIMEFRAME
    =========================
    */


    const validSignals =
        analyses.filter(

            item =>
                item.data.decision !==
                "NO TRADE"

        );


    if (
        validSignals.length === 0
    ) {

        console.log(
            asset,
            "NO GOOD TRADE"
        );

        return;

    }


    validSignals.sort(

        (a, b) =>

            b.data.confidence -

            a.data.confidence

    );


    const bestSignal =
        validSignals[0];


    /*
    =========================
    TIMEFRAME CONFIRMATION
    =========================
    */


    const sameDirectionCount =
        analyses.filter(

            item =>

                item.data.decision ===

                bestSignal.data.decision

        ).length;


    /*
    Require confirmation from
    at least two timeframes
    */


    if (
        sameDirectionCount < 2
    ) {

        console.log(

            asset,

            "Timeframes disagree"

        );

        return;

    }


    await sendSignal(

        asset,

        bestSignal.timeframe,

        bestSignal.data

    );

}


/*
=============================
MARKET DATA
=============================

This is intentionally empty.

We will connect a legitimate
market-data provider here.

*/

async function getMarketData(
    asset,
    timeframe
) {

    console.log(

        `Getting ${asset} ${timeframe} data`

    );


    return [];

}


/*
=============================
SCAN MARKETS
=============================
*/


const assets = [

    "EUR/USD",

    "GBP/USD",

    "USD/JPY"

];


async function scanMarket() {

    console.log(
        "🔍 Scanning market..."
    );


    for (
        const asset of assets
    ) {

        try {

            await scanAsset(asset);

        } catch (error) {

            console.error(

                asset,

                error.message

            );

        }

    }

}


/*
=============================
SCAN EVERY MINUTE
=============================
*/


setInterval(

    scanMarket,

    60 * 1000

);


/*
=============================
START SERVER
=============================
*/


app.listen(

    PORT,

    () => {

        console.log(

            `Server running on port ${PORT}`

        );

    }

);


scanMarket();