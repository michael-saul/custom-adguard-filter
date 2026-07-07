import fs from "node:fs";

const cfg = JSON.parse(fs.readFileSync("configuration.json", "utf8"));

const regionalPatterns = [
  /spanish|portuguese/i,
  /cyrillic|russian|ukrainian|belarusian|bulgarian|kazakh/i,
  /turkish|french|japanese|german|chinese|dutch/i,
  /easylist (germany|hebrew|italy|china|dutch)/i,
  /abpindo/i,
  /adblockid/i,
  /hostsvn/i,
  /hufilter/i,
  /frellwits|swedish/i,
  /persian/i,
  /list-kr/i
];

const removed = [];

cfg.name = "AdGuard DNS filter without regional/language sources";
cfg.description =
  "AdGuard DNS filter rebuilt from upstream configuration with regional/language-specific sources removed.";

cfg.sources = cfg.sources.filter((source) => {
  const haystack = `${source.name ?? ""} ${source.source ?? ""}`;
  const shouldRemove = regionalPatterns.some((pattern) => pattern.test(haystack));

  if (shouldRemove) {
    removed.push(source.name);
  }

  return !shouldRemove;
});

fs.writeFileSync("configuration.noregion.json", JSON.stringify(cfg, null, 2) + "\n");

console.log(`Kept ${cfg.sources.length} sources`);
console.log(`Removed ${removed.length} sources:`);
for (const name of removed) {
  console.log(`- ${name}`);
}
