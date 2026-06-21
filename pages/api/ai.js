// pages/api/ai.js
// SlipMint assistant with tool calling, primary: Claude, fallback: Gemini.
// crypto prices (CoinGecko), market/forex news (cryptonews-api), invoice drafting, trading checklists.

const SYSTEM_PROMPT = `You are the SlipMint AI Assistant, embedded on luckmanworld.icu — a crypto and forex infrastructure platform built on research, transparency, and disciplined trading. Founded by Hassan Luckman.

ABOUT SLIPMINT
- SlipMint is a crypto/DeFi platform (Next.js, Firebase, Supabase, Base Network) offering research, portfolio tooling, and a disciplined-trading philosophy — not a signals-for-hire shop and not a financial advisor.
- Brand voice: disciplined, structured, no hype, risk-aware. Never promotional or "to the moon" language.

PRODUCTS & TIERS
- Founder Vault (on Whop): the premium membership product for forex and gold (XAUUSD) traders. Pricing: [FILL IN — e.g. "$49/month" or tiered pricing]. If you don't know current pricing, say "check the Whop page for current pricing" rather than guessing. Includes private research notes, structured strategy breakdowns, and the Trading Discipline Toolkit:
  - Position Size Calculator
  - Risk/Reward Calculator
  - Pre-Flight Checklist
  - Revenge Trade Lockout Timer
  - Trade Journal
- Free tier: weekly research + general market commentary, lower-frequency and less detailed than Founder Vault.
- Telegram (@slipmintsignals or SlipMint's channel): primary distribution channel for forex trading signal alerts and educational posts for intermediate forex traders.
- Affiliate partners: Gate.io (crypto exchange) and Exness (forex broker) — SlipMint is an approved affiliate for both; affiliate links live on the site.

COMPLIANCE & RISK DISCLAIMERS (ALWAYS FOLLOW)
- Never give direct financial advice — no "buy now," "this will go up," "guaranteed returns," or specific entry/exit calls presented as certainty.
- Frame all market commentary as research, education, and risk management, not instructions to trade.
- When discussing signals or Founder Vault, be clear these are educational/research tools, not a guarantee of profit. Trading carries risk of loss.
- If a user asks for something that sounds like "tell me what to buy" or "guarantee I'll make money," redirect to risk management and encourage them to do their own due diligence.

YOUR JOB
- Answer questions about crypto/forex markets using live data when relevant (use tools, don't guess prices — your training data is outdated for fast-moving prices/news).
- Help visitors understand Founder Vault, the Trading Discipline Toolkit, and how SlipMint's research works.
- Draft invoices/payment requests when asked (Founder Vault billing, signal subscriptions, etc.).
- Draft trading checklists (pre-flight checks, risk checks) in the spirit of disciplined trading.
- Keep replies concise and chat-friendly (this renders in a small floating widget) — short paragraphs or brief lists, not long essays.

GUIDED RECOMMENDATIONS (concierge behavior)
When a user describes their situation (experience level, goals, what they're struggling with, risk tolerance), use that to recommend the right SlipMint resource — not a trade.
- If they're new to trading or ask basic concept questions → recommend free-tier educational content, explain a concept directly, or suggest the relevant SlipMint tool (e.g. Pre-Flight Checklist for someone who says they keep entering trades impulsively).
- If they describe a specific recurring problem (overleveraging, revenge trading, no journal discipline, unclear risk/reward) → recommend the specific Trading Discipline Toolkit item built for that problem, and explain briefly why it fits.
- If they're an active/intermediate trader wanting deeper research or signals → recommend Founder Vault or the Telegram channel, as appropriate.
- Always ask 1 clarifying question if their goal or experience level is unclear, rather than guessing — e.g. "Are you looking for live signals, or more for the risk-management side of things?"
- This is product/education routing, NOT trade advice. Never let "based on our conversation" become "based on our conversation, buy/sell X." The line is: you can recommend a TOOL or RESOURCE based on what they tell you; you cannot recommend a TRADE, ENTRY, or ASSET ALLOCATION based on what they tell you. If a user pushes for the latter, restate that clearly and redirect to the risk-management tools instead.

If a user asks for live prices or news, ALWAYS use the tools rather than relying on your own knowledge.`;

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
  {
    name: "recommend_resource",
    description: "Recommend a specific SlipMint product, tool, or educational resource based on what the user has described about their experience level, goals, or trading struggles. Use this when a user describes their situation and you want to point them somewhere specific. Do NOT use this to suggest trades, entries, or asset allocations — only products/tools/education.",
    input_schema: {
      type: "object",
      properties: {
        user_situation: { type: "string", description: "Brief summary of what the user described, e.g. 'new trader, keeps overleveraging' or 'wants live forex signals'" },
        recommendation: {
          type: "string",
          enum: [
            "Position Size Calculator",
            "Risk/Reward Calculator",
            "Pre-Flight Checklist",
            "Revenge Trade Lockout Timer",
            "Trade Journal",
            "Founder Vault",
            "Free weekly research",
            "Telegram signal channel",
          ],
          description: "Which SlipMint resource best fits the user's situation",
        },
        reason: { type: "string", description: "One short sentence on why this fits their situation" },
      },
      required: ["user_situation", "recommendation", "reason"],
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

function recommendResource({ user_situation, recommendation, reason }) {
  return {
    acknowledged: true,
    user_situation,
    recommendation,
    reason,
    note: "This is a product/education recommendation only — not trade advice.",
  };
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
    case "recommend_resource":
      return recommendResource(input);
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
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errText}`);
  }

  return res.json();
}

// ---- Gemini fallback ----
// Converts Claude-style { role, content } messages into Gemini's { role, parts } format,
// and Claude-style tool_use/tool_result blocks into Gemini's functionCall/functionResponse parts.
// Returns a response already normalized into Claude's shape ({ content: [...], stop_reason })
// so the rest of the handler (the tool-use loop, text extraction) doesn't need to know which
// provider answered.

function claudeToolsToGemini(tools) {
  return [
    {
      function_declarations: tools.map((t) => ({
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      })),
    },
  ];
}

function claudeMessagesToGemini(messages) {
  const contents = [];
  for (const m of messages) {
    if (typeof m.content === "string") {
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
      continue;
    }
    // content is an array of blocks (text, tool_use, or tool_result)
    const parts = [];
    for (const block of m.content) {
      if (block.type === "text") {
        parts.push({ text: block.text });
      } else if (block.type === "tool_use") {
        parts.push({ functionCall: { name: block.name, args: block.input } });
      } else if (block.type === "tool_result") {
        let responseObj;
        try {
          responseObj = JSON.parse(block.content);
        } catch {
          responseObj = { result: block.content };
        }
        parts.push({
          functionResponse: {
            name: block.tool_use_id || "tool_result",
            response: responseObj,
          },
        });
      }
    }
    contents.push({ role: m.role === "assistant" ? "model" : "user", parts });
  }
  return contents;
}

async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const body = {
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: claudeMessagesToGemini(messages),
    tools: claudeToolsToGemini(TOOLS),
    generationConfig: { maxOutputTokens: 1024 },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];
  const geminiParts = candidate?.content?.parts || [];

  // Normalize into Claude's response shape so the caller's tool-use loop works unmodified.
  const content = geminiParts.map((p) => {
    if (p.functionCall) {
      return {
        type: "tool_use",
        id: `gemini_${p.functionCall.name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: p.functionCall.name,
        input: p.functionCall.args || {},
      };
    }
    return { type: "text", text: p.text || "" };
  });

  const hasFunctionCall = content.some((b) => b.type === "tool_use");

  return {
    content,
    stop_reason: hasFunctionCall ? "tool_use" : "end_turn",
  };
}

// Tries Claude first; on any failure (missing key, timeout, rate limit, 5xx), falls back to Gemini.
async function callModel(messages) {
  try {
    return await callClaude(messages);
  } catch (claudeErr) {
    console.error("[ai.js] Claude failed, falling back to Gemini:", claudeErr.message);
    try {
      return await callGemini(messages);
    } catch (geminiErr) {
      console.error("[ai.js] Gemini fallback also failed:", geminiErr.message);
      throw new Error(
        `Both providers failed. Claude: ${claudeErr.message} | Gemini: ${geminiErr.message}`
      );
    }
  }
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

    let data = await callModel(messages);
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

      data = await callModel(messages);
    }

    const textBlocks = (data.content || []).filter((b) => b.type === "text");
    const reply = textBlocks.map((b) => b.text).join("\n").trim() || "No response generated.";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
