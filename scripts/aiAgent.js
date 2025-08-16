import fs from "fs";
import OpenAI from "openai";

// Initialize OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Read the PR diff, routes, and dependency graph
const diff = fs.readFileSync("pr.diff", "utf8");
const routes = JSON.parse(fs.readFileSync("routes.json", "utf8"));
const deps = JSON.parse(fs.readFileSync("deps.json", "utf8"));

const prompt = `
You are an AI code analysis agent.

Here is the Git diff for this PR:
${diff}

Here are the Express routes:
${JSON.stringify(routes, null, 2)}

Here is the dependency graph:
${JSON.stringify(deps, null, 2)}

Task:
1. Identify which routes might be impacted by the changed code.
2. Output a Markdown report:
   - List of impacted routes
   - Mermaid diagram showing dependencies from changed code → routes
`;

(async () => {
  try {
    const res = await client.chat.completions.create({
      model: "gpt-3.5-turbo",       // use GPT-4o-mini
      messages: [{ role: "user", content: prompt }],
    });

    const output = res.choices[0].message?.content || "No analysis";
    fs.writeFileSync("impact.md", output);
    console.log(output);
  } catch (err) {
    if (err.code === "insufficient_quota" || err.status === 429) {
      fs.writeFileSync("impact.md", "⚠️ OpenAI quota exceeded. Analysis skipped.");
      console.warn("OpenAI quota exceeded, skipping AI analysis.");
    } else {
      throw err;
    }
  }
})();
