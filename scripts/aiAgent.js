import fs from "fs";
import fetch from "node-fetch"; // If using Node 18+, fetch is built-in

const API_KEY = process.env.DEEPSEEK_API_KEY;

// Read PR diff, routes, deps
const diff = fs.readFileSync("pr.diff", "utf8");
const routes = JSON.parse(fs.readFileSync("routes.json", "utf8"));
const deps = JSON.parse(fs.readFileSync("deps.json", "utf8"));

const prompt = `
You are an AI code analysis agent.

Git diff:
${diff}

Express routes:
${JSON.stringify(routes, null, 2)}

Dependency graph:
${JSON.stringify(deps, null, 2)}

Task:
1. Identify which routes might be impacted by the changed code.
2. Output a Markdown report with:
   - List of impacted routes
   - Mermaid diagram showing dependencies
`;

// Send request to DeepSeek via OpenRouter
(async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-r1:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "No analysis";
    fs.writeFileSync("impact.md", output);
    console.log(output);
  } catch (err) {
    console.error("Error calling DeepSeek API:", err);
    fs.writeFileSync("impact.md", "⚠️ DeepSeek API failed. Analysis skipped.");
  }
})();
