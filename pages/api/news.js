export default async function handler(req, res) {
  try {
    const { coin, start, end } = req.query;

    // BASE ENDPOINT WITH API KEY
    let endpoint = `https://cryptonews-api.com/api/v1?apikey=${process.env.CRYPTO_NEWS_API_KEY}`;

    // OPTIONAL FILTERS
    if (coin) endpoint += `&coin=${coin}`;
    if (start && end) endpoint += `&start=${start}&end=${end}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    res.status(200).json({ news: data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
