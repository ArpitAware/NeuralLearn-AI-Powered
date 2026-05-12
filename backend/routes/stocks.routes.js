/**
 * routes/stocks.routes.js
 * Proxies Yahoo Finance requests server-side — no CORS, no API key needed
 */
const express = require('express');
const router = express.Router();

const STOCKS = [
  'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS',
  'INFY.NS', 'ICICIBANK.NS', 'SBIN.NS',
];

router.get('/', async (req, res) => {
  try {
    const symbols = req.query.symbols
      ? req.query.symbols.split(',')
      : STOCKS;

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`;
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json',
            },
          });

          if (!response.ok) return { symbol, error: true };

          const data = await response.json();
          const chart = data?.chart?.result?.[0];
          if (!chart) return { symbol, error: true };

          const quotes  = chart.indicators?.quote?.[0];
          const closes  = quotes?.close?.filter(Boolean) || [];
          const highs   = quotes?.high?.filter(Boolean)  || [];
          const lows    = quotes?.low?.filter(Boolean)   || [];

          if (closes.length < 2) return { symbol, error: true };

          const current   = closes[closes.length - 1];
          const prev      = closes[closes.length - 2];
          const change    = current - prev;
          const changePct = (change / prev) * 100;

          return {
            symbol,
            price:     parseFloat(current.toFixed(2)),
            change:    parseFloat(change.toFixed(2)),
            changePct: parseFloat(changePct.toFixed(2)),
            high:      parseFloat(Math.max(...highs).toFixed(2)),
            low:       parseFloat(Math.min(...lows).toFixed(2)),
            name:      chart.meta?.longName || symbol,
          };
        } catch {
          return { symbol, error: true };
        }
      })
    );

    res.json({ success: true, data: results, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stock data' });
  }
});

module.exports = router;
