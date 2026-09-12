function calculateEMA(prices, period) {
    if (prices.length < period) return null;

    const multiplier = 2 / (period + 1);

    let ema = prices
        .slice(0, period)
        .reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
}


function calculateRSI(prices, period = 14) {

    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {

        const difference = prices[i] - prices[i - 1];

        if (difference >= 0) {
            gains += difference;
        } else {
            losses += Math.abs(difference);
        }
    }

    const averageGain = gains / period;
    const averageLoss = losses / period;

    if (averageLoss === 0) return 100;

    const rs = averageGain / averageLoss;

    return 100 - (100 / (1 + rs));
}


function calculateVolatility(prices, period = 20) {

    if (prices.length < period) return null;

    const data = prices.slice(-period);

    const average =
        data.reduce((a, b) => a + b, 0) / data.length;

    const variance =
        data.reduce(
            (sum, price) =>
                sum + Math.pow(price - average, 2),
            0
        ) / data.length;

    return Math.sqrt(variance);
}


module.exports = {
    calculateEMA,
    calculateRSI,
    calculateVolatility
};