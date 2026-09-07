import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const addonFolders = [
  "chayalert-hud",
  "chaychat",
  "chaydemoniccore",
  "chaylfgregions",
  "chaybar",
  "chayimages",
  "chaymedia",
];

const supportedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const projectRoot = process.cwd();
const screenshotsRoot = path.join(projectRoot, "public", "images", "addons");
const outputFile = path.join(projectRoot, "app", "generated", "addonScreenshots.ts");

const metadata = {};

for (const folder of addonFolders) {
  const folderPath = path.join(screenshotsRoot, folder);
  await mkdir(folderPath, { recursive: true });

  const files = await readdir(folderPath, { withFileTypes: true });
  const screenshots = files
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => !fileName.startsWith("."))
    .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((first, second) => first.localeCompare(second, undefined, { numeric: true, sensitivity: "base" }))
    .map((fileName) => `/images/addons/${folder}/${fileName}`);

  if (screenshots.length === 0 && !files.some((entry) => entry.name === ".gitkeep")) {
    await writeFile(path.join(folderPath, ".gitkeep"), "");
  }

  metadata[folder] = screenshots;
}

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(
  outputFile,
  `export const addonScreenshots = ${JSON.stringify(metadata, null, 2)} as const;\n`,
);

console.log(`Generated ${path.relative(projectRoot, outputFile)} from ${addonFolders.length} addon screenshot folders.`);
