// slipmint-portal/pages/api/gate-market.js
//
// Read-only Gate.io crypto market data endpoint.
// No API key required. Supports: tickers, candlesticks, order book.
//
// Examples:
//   GET /api/gate-market?type=ticker&pair=BTC_USDT
//   GET /api/gate-market?type=candles&pair=BTC_USDT&interval=15m&limit=100
//   GET /api/gate-market?type=orderbook&pair=BTC_USDT&limit=10

import {
  getTickers,
  getCandlesticks,
  getOrderBook,
  parseCandlesticks,
  summarizeTicker,
} from "../../lib/gate-market-data";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use GET." });
  }

  const { type = "ticker", pair = "BTC_USDT", interval = "15m", limit } = req.query;

  try {
    if (type === "ticker") {
      const tickers = await getTickers(pair);
      const ticker = Array.isArray(tickers) ? tickers[0] : tickers;
      return res.status(200).json({ success: true, data: summarizeTicker(ticker) });
    }

    if (type === "candles") {
      const rows = await getCandlesticks(pair, {
        interval,
        limit: limit ? Number(limit) : 100,
      });
      return res.status(200).json({ success: true, data: parseCandlesticks(rows) });
    }

    if (type === "orderbook") {
      const book = await getOrderBook(pair, limit ? Number(limit) : 10);
      return res.status(200).json({ success: true, data: book });
    }

    return res.status(400).json({
      success: false,
      error: `Unknown type "${type}". Use "ticker", "candles", or "orderbook".`,
    });
  } catch (error) {
    console.error("[gate-market] error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
