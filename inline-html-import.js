const fs = require("fs");
const path = require("path");

module.exports = ({ types: t }) => ({
  visitor: {
    CallExpression: {
      exit(nodePath, state) {
        const callee = nodePath.get("callee");
        if (!callee.isIdentifier({ name: "__importStar" })) return;

        const importedModule = nodePath.get("arguments.0");
        if (!importedModule.isCallExpression()) return;

        const requireCallee = importedModule.get("callee");
        const modulePath = importedModule.get("arguments.0");
        if (
          !requireCallee.isIdentifier({ name: "require" }) ||
          !modulePath.isStringLiteral() ||
          !modulePath.node.value.endsWith(".html")
        ) {
          return;
        }

        const htmlPath = path.resolve(
          path.dirname(state.file.opts.filename),
          modulePath.node.value,
        );
        const html = fs.readFileSync(htmlPath, "utf8");
        nodePath.replaceWith(t.stringLiteral(html));
      },
    },
  },
});
