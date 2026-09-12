const {
    calculateEMA,
    calculateRSI,
    calculateVolatility
} = require("./indicators");


function analyzeMarket(candles) {

    if (!candles || candles.length < 50) {
        return {
            decision: "NO TRADE",
            confidence: 0,
            reason: "Not enough market data"
        };
    }


    const prices = candles.map(c => c.close);


    const ema9 = calculateEMA(prices, 9);
    const ema21 = calculateEMA(prices, 21);

    const rsi = calculateRSI(prices, 14);

    const volatility =
        calculateVolatility(prices, 20);


    const currentPrice =
        prices[prices.length - 1];


    let upScore = 0;
    let downScore = 0;

    let reasons = [];


    /*
    ==========================
    TREND ANALYSIS
    ==========================
    */

    if (ema9 > ema21) {

        upScore += 30;

        reasons.push(
            "Bullish EMA trend"
        );

    } else if (ema9 < ema21) {

        downScore += 30;

        reasons.push(
            "Bearish EMA trend"
        );
    }


    /*
    ==========================
    RSI MOMENTUM
    ==========================
    */

    if (rsi > 50 && rsi < 70) {

        upScore += 20;

        reasons.push(
            "Bullish RSI momentum"
        );

    } else if (rsi < 50 && rsi > 30) {

        downScore += 20;

        reasons.push(
            "Bearish RSI momentum"
        );
    }


    /*
    ==========================
    OVERBOUGHT / OVERSOLD
    ==========================
    */

    if (rsi >= 75) {

        downScore += 10;

        reasons.push(
            "Market may be overbought"
        );

    }

    if (rsi <= 25) {

        upScore += 10;

        reasons.push(
            "Market may be oversold"
        );

    }


    /*
    ==========================
    PRICE VS EMA
    ==========================
    */

    if (currentPrice > ema9) {

        upScore += 15;

    } else {

        downScore += 15;

    }


    /*
    ==========================
    LAST CANDLE MOMENTUM
    ==========================
    */

    const lastCandle =
        candles[candles.length - 1];


    if (lastCandle.close > lastCandle.open) {

        upScore += 15;

        reasons.push(
            "Last candle bullish"
        );

    } else if (
        lastCandle.close < lastCandle.open
    ) {

        downScore += 15;

        reasons.push(
            "Last candle bearish"
        );

    }


    /*
    ==========================
    DECISION
    ==========================
    */

    let decision = "NO TRADE";

    let confidence = 0;


    if (
        upScore > downScore &&
        upScore >= 60
    ) {

        decision = "UP";

        confidence = upScore;

    }


    if (
        downScore > upScore &&
        downScore >= 60
    ) {

        decision = "DOWN";

        confidence = downScore;

    }


    /*
    ==========================
    MARKET FILTER
    ==========================
    */

    if (
        volatility === null ||
        volatility === 0
    ) {

        decision = "NO TRADE";

        confidence = 0;

        reasons.push(
            "Low market activity"
        );

    }


    return {

        decision,

        confidence,

        price: currentPrice,

        ema9,

        ema21,

        rsi,

        volatility,

        reasons

    };

}


module.exports = {
    analyzeMarket
};