// // scripts/analyzeRoutes.js
// const madge = require("madge");
// const glob = require("glob");
// const fs = require("fs");

// // Extract Express routes from files
// function extractRoutes() {
//   const routes = {};
//   glob.sync("src/**/*.js").forEach(file => {
//     const content = fs.readFileSync(file, "utf8");
//     const matches = content.matchAll(/(app|router)\.(get|post|put|delete)\(['"`](.*?)['"`]/g);

//     for (const match of matches) {
//       if (!routes[file]) routes[file] = [];
//       routes[file].push({ method: match[2], path: match[3] });
//     }
//   });
//   return routes;
// }

// (async () => {
//   const routes = extractRoutes();
//   const graph = await madge("./src").then(res => res.obj());

//   fs.writeFileSync("routes.json", JSON.stringify(routes, null, 2));
//   fs.writeFileSync("deps.json", JSON.stringify(graph, null, 2));
// })();
