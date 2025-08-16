const fs = require("fs");

// This is a mock output to simulate AI analysis without API calls
fs.writeFileSync("impact.md", `
# AI Analysis (Mock)
- Route /users impacted by changes
- Route /orders impacted by changes

\`\`\`mermaid
graph TD
  change --> /users
  change --> /orders
\`\`\`
`);

console.log("Mock impact.md generated");
