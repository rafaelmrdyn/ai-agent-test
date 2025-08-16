import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Read the diff directly from file
const diff = fs.readFileSync("pr.diff", "utf8");
const routes = JSON.parse(fs.readFileSync("routes.json", "utf8"));
const deps = JSON.parse(fs.readFileSync("deps.json", "utf8"));

const prompt = `
You are an AI code analysis agent.

Here is the Git diff for this PR:
${diff}

Here are the Express routes in the repo:
${JSON.stringify(routes, null, 2)}

Here is the dependency graph:
${JSON.stringify(deps, null, 2)}

Task:
1. Identify which routes might be impacted by the changed code.
2. Explain briefly why.
3. Output a Markdown report:
   - List of impacted routes
   - Mermaid diagram showing dependencies from changed code → routes
`;

(async () => {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const output = res.choices[0].message?.content || "No analysis";
  fs.writeFileSync("impact.md", output);
  console.log(output);
})();
