const fs = require("fs");
const path = require("path");

const base = process.cwd();
const src = path.join(base, process.argv[2]);
const srcFolder = path.parse(src).dir;
const out = path.join(base, process.argv[3]);

let htmlStr = "";

console.log("Building HTML...");

try {
  htmlStr = fs.readFileSync(src, { encoding: "utf-8" });
} catch (error) {
  throw error;
}

const split = htmlStr.split("</head>");

const headTags = (split[0] + ["</head>"])
  .split("\r\n")
  .filter(Boolean)
  .map((tag) => {
    return tag.trim();
  });

const bodyTags = split[1]
  .split("\r\n")
  .filter(Boolean)
  .map((tag) => {
    return tag.trim();
  });

headTags.forEach((tag, idx) => {
  if (tag.startsWith("<link") && tag.includes("stylesheet")) {
    const cssFileName = tag.split("href=")[1].replace(/\'/g, '"').split('"')[1];
    const cssUrl = path.join(srcFolder, cssFileName);
    const cssContent = fs.readFileSync(cssUrl, "utf-8");

    headTags[idx] = "<style>" + cssContent.replace(/\r\n/g, "") + "</style>";
  }
});

bodyTags.forEach((tag, idx) => {
  if (tag.startsWith("<script") && tag.includes("src=")) {
    const jsFileName = tag.split("src=")[1].replace(/\'/g, '"').split('"')[1];
    const jsUrl = path.join(srcFolder, jsFileName);
    const jsContent = fs.readFileSync(jsUrl, "utf-8");

    bodyTags[idx] = "<script>\n" + jsContent + "</script>";
  }
});

let newHtml = "";
headTags.forEach((tag) => {
  newHtml += tag + "\n";
});
bodyTags.forEach((tag) => {
  newHtml += tag + "\n";
});

fs.mkdir(path.parse(out).dir, { recursive: true }, (error) => {
  if (error) throw error;
  fs.writeFileSync(out, newHtml);
  console.log("Done...");
});
