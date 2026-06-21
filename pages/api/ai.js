// pages/api/ai.js
// Claude-powered SlipMint assistant with tool calling:
// crypto prices (CoinGecko), market/forex news (cryptonews-api), invoice drafting, trading checklists.

const SYSTEM_PROMPT = `You are the SlipMint AI Assistant, embedded on luckmanworld.icu — a crypto infrastructure platform built on research, transparency, and disciplined trading.

About SlipMint:
- Founder Vault: premium membership with private research notes and strategy
- Free tier: weekly research + market commentary
- Telegram: @slipmintsignals for signal alerts
- Partner platforms: Gate.io and Exness (affiliate links on site)
- Brand voice: disciplined, structured, no hype, risk-aware

Your job:
- Answer questions about crypto/forex markets using live data when relevant (use tools, don't guess prices)
- Help visitors understand Founder Vault and how SlipMint's research works
- Draft invoices/payment requests when asked (Founder Vault billing, signal subscriptions, etc.)
- Draft trading checklists (pre-flight checks, risk checks) in the spirit of disciplined trading
- Never give direct financial advice ("buy now", "guaranteed returns") — frame things as research, structure, and risk management, consistent with the SlipMint brand
- Keep replies concise and chat-friendly (this renders in a small floating widget), not long essays

If a user asks for live prices or news, ALWAYS use the tools rather than relying on your own knowledge — prices and news move fast and your training data is outdated.`;

const TOOLS = [
  {
    name: "get_crypto_price",
    description: "Get current price, 24h change, and market cap for one or more cryptocurrencies from CoinGecko.",
    input_schema: {
      type: "object",
      properties: {
        coin_ids: {
          type: "array",
          items: { type: "string" },
          description: "CoinGecko coin IDs, lowercase, e.g. ['bitcoin', 'ethereum', 'solana']",
        },
      },
      required: ["coin_ids"],
    },
  },
  {
    name: "get_market_news",
    description: "Get recent crypto/forex market news headlines. Use when the user asks about market conditions, recent events, or news on a specific coin.",
    input_schema: {
      type: "object",
      properties: {
        coin: {
          type: "string",
          description: "Optional coin ticker to filter news by, e.g. 'BTC'. Omit for general market news.",
        },
      },
    },
  },
  {
    name: "draft_invoice",
    description: "Draft an invoice or payment request for a SlipMint product (Founder Vault membership, signal subscription, etc). Returns formatted text the user can copy and send.",
    input_schema: {
      type: "object",
      properties: {
        client_name: { type: "string", description: "Name of the person/entity being billed" },
        item_description: { type: "string", description: "What is being billed for, e.g. 'Founder Vault — Monthly Membership'" },
        amount: { type: "string", description: "Amount including currency, e.g. '$49.00 USD'" },
        due_date: { type: "string", description: "Due date, e.g. 'within 7 days' or a specific date" },
        notes: { type: "string", description: "Optional extra notes (payment method, wallet address, etc.)" },
      },
      required: ["client_name", "item_description", "amount"],
    },
  },
  {
    name: "draft_trading_checklist",
    description: "Draft a pre-trade or risk-management checklist for a trader, in SlipMint's disciplined-trading style. Use when a user asks for a checklist, pre-flight check, or risk check before entering a trade.",
    input_schema: {
      type: "object",
      properties: {
        instrument: { type: "string", description: "What's being traded, e.g. 'BTC/USD', 'XAUUSD', 'EUR/USD'" },
        trade_type: { type: "string", description: "e.g. 'swing trade', 'scalp', 'long-term position'" },
        focus: { type: "string", description: "Optional specific concern to emphasize, e.g. 'overleveraging' or 'news risk'" },
      },
      required: ["instrument"],
    },
  },
];

async function getCryptoPrice(coinIds) {
  const ids = coinIds.map((c) => c.toLowerCase()).join(",");
  const apiKey = process.env.COINGECKO_API_KEY;
  let url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
    ids
  )}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
  if (apiKey) url += `&x_cg_demo_api_key=${apiKey}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
  return res.json();
}

async function getMarketNews(coin) {
  const apiKey = process.env.CRYPTO_NEWS_API_KEY;
  if (!apiKey) {
    return { error: "News API key not configured" };
  }
  let endpoint = `https://cryptonews-api.com/api/v1?apikey=${apiKey}`;
  if (coin) endpoint += `&coin=${coin}`;
  else endpoint += `&section=general`;

  const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`News API responded ${res.status}`);
  const data = await res.json();
  const items = (data?.data || []).slice(0, 5).map((a) => ({
    title: a.title,
    date: a.date,
    source: a.source_name,
    sentiment: a.sentiment,
  }));
  return { headlines: items };
}

function draftInvoice({ client_name, item_description, amount, due_date, notes }) {
  const lines = [
    `INVOICE — SlipMint`,
    ``,
    `Bill To: ${client_name}`,
    `Description: ${item_description}`,
    `Amount Due: ${amount}`,
  ];
  if (due_date) lines.push(`Due: ${due_date}`);
  if (notes) lines.push(``, `Notes: ${notes}`);
  lines.push(``, `Questions? Contact hassanluckman5@gmail.com`);
  return { invoice_text: lines.join("\n") };
}

async function executeTool(name, input) {
  switch (name) {
    case "get_crypto_price":
      return await getCryptoPrice(input.coin_ids);
    case "get_market_news":
      return await getMarketNews(input.coin);
    case "draft_invoice":
      return draftInvoice(input);
    case "draft_trading_checklist":
      return { acknowledged: true, instrument: input.instrument, trade_type: input.trade_type || null, focus: input.focus || null };
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

async function callClaude(messages) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const priorMessages = Array.isArray(history)
      ? history.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }))
      : [];

    let messages = [...priorMessages, { role: "user", content: message }];

    let data = await callClaude(messages);
    let loopCount = 0;

    while (data.stop_reason === "tool_use" && loopCount < 4) {
      loopCount++;
      const toolUseBlocks = data.content.filter((b) => b.type === "tool_use");

      const toolResults = await Promise.all(
        toolUseBlocks.map(async (block) => {
          try {
            const result = await executeTool(block.name, block.input);
            return {
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify(result),
            };
          } catch (err) {
            return {
              type: "tool_result",
              tool_use_id: block.id,
              content: JSON.stringify({ error: err.message }),
              is_error: true,
            };
          }
        })
      );

      messages = [
        ...messages,
        { role: "assistant", content: data.content },
        { role: "user", content: toolResults },
      ];

      data = await callClaude(messages);
    }

    const textBlocks = (data.content || []).filter((b) => b.type === "text");
    const reply = textBlocks.map((b) => b.text).join("\n").trim() || "No response generated.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
