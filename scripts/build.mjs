import { readFile, mkdir, copyFile, rm } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const html = await readFile(join(root, "index.html"), "utf8");
const styles = await readFile(join(root, "styles.css"), "utf8");
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Duplicate HTML IDs");
for (const match of html.matchAll(/href="#([^"]+)"/g))
  assert(ids.includes(match[1]), `Missing anchor ${match[1]}`);
assert.equal(
  (html.match(/<h1\b/g) || []).length,
  1,
  "One main heading is required",
);
assert.equal(
  (html.match(/data-book=/g) || []).length,
  6,
  "Expected six published books",
);
assert(
  !html.includes("data:image"),
  "Images must be separate cacheable assets",
);
assert(!html.includes("/Users/"), "Local paths must not enter public HTML");
assert(
  !html.includes("f/embed.php"),
  "The official newsletter is loaded once by newsletter.js",
);
const files = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "newsletter.js",
  "robots.txt",
  "sitemap.xml",
  "assets/fonts/OFL.txt",
]);
for (const match of html.matchAll(/(?:src|href)="\/(?!\/)([^"#?]+)"/g))
  files.add(match[1]);
for (const match of styles.matchAll(/url\(['"]?\/([^'"\)]+)['"]?\)/g))
  files.add(match[1]);
for (const file of files) {
  assert(
    !file.includes("..") &&
      !file.includes("PROVENANCE") &&
      !file.includes("_sistema"),
    `Unsafe public file: ${file}`,
  );
  await readFile(join(root, file));
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
let bytes = 0;
for (const file of files) {
  await mkdir(dirname(join(output, file)), { recursive: true });
  await copyFile(join(root, file), join(output, file));
  bytes += (await readFile(join(output, file))).length;
}
console.log(
  `Build OK: ${files.size} public files, ${Math.round(bytes / 1024)} KB uncompressed. Internal notes excluded.`,
);
