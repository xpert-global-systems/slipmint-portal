import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    // 1. Fetch latest crypto news from your existing API
    const newsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/news`);
    const newsData = await newsRes.json();

    if (!newsData.news || !newsData.news.data || newsData.news.data.length === 0) {
      return res.status(400).json({ error: "No news available" });
    }

    // 2. Take the first article
    const article = newsData.news.data[0];

    // 3. Create SEO-friendly slug
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // 4. Build SEO content
    const seoContent = `
<h1>${article.title}</h1>

<p><strong>Source:</strong> ${article.source_name}</p>
<p><strong>Published:</strong> ${article.date}</p>

<hr />

<p>${article.text.slice(0, 600)}...</p>

<hr />

<h2>SlipMint Summary</h2>
<p>
This article highlights important market movements and trader sentiment.
SlipMint provides structured insights and weekly research for deeper analysis.
</p>

<h2>Related Topics</h2>
<ul>
  <li>Bitcoin news</li>
  <li>Market analysis</li>
  <li>Crypto research</li>
</ul>
`;

    // 5. Ensure /generated folder exists
    const dir = path.join(process.cwd(), "generated");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    // 6. Save the article as a markdown file
    const filePath = path.join(dir, `${slug}.md`);
    fs.writeFileSync(filePath, seoContent);

    return res.status(200).json({
      success: true,
      slug,
      message: "Post generated successfully"
    });

  } catch (error) {
    console.error("Error generating post:", error);
    return res.status(500).json({ error: "Failed to generate post" });
  }
}
