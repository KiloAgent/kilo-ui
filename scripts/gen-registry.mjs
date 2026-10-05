#!/usr/bin/env node
/**
 * Regenerates registry.json from src/.
 *
 * Every file keeps the repo layout under `components/kilo-ui/` in the
 * consumer project, so relative imports (../lib/cn, ./badge) resolve after
 * `npx shadcn add KiloAgent/kilo-ui/<item>`. npm deps and same-registry
 * dependencies are derived from each file's imports.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, basename, extname } from "node:path";

const REPO = "KiloAgent/kilo-ui";
const ROOT = new URL("..", import.meta.url).pathname;
const TARGET_BASE = "components/kilo-ui";
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const ver = (n) => (pkg.dependencies?.[n] ? `${n}@${pkg.dependencies[n]}` : n);
const prev = JSON.parse(readFileSync(join(ROOT, "registry.json"), "utf8"));
const prevByName = new Map(prev.items.map((i) => [i.name, i]));

const title = (s) => s.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const list = (dir) =>
  readdirSync(join(ROOT, "src", dir)).filter((f) => [".ts", ".tsx"].includes(extname(f))).sort();

// item name for a src-relative module path like "components/button" or "lib/cn"
function itemFor(modPath) {
  const [dir, file] = modPath.split("/");
  if (dir === "components") return file;
  if (dir === "marketing") return `marketing-${file}`;
  if (dir === "lib") return file;
  throw new Error(`unknown module ${modPath}`);
}

function analyze(dir, file) {
  const src = readFileSync(join(ROOT, "src", dir, file), "utf8");
  const deps = new Set();
  const reg = new Set();
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const spec = m[1];
    if (spec.startsWith(".")) {
      const parts = spec.split("/");
      const mod = spec.startsWith("../") ? `${parts[1]}/${parts[2]}` : `${dir}/${parts[1]}`;
      reg.add(`${REPO}/${itemFor(mod)}`);
    } else if (!["react", "react-dom"].includes(spec) && !spec.startsWith("react/")) {
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];
      deps.add(pkg);
    }
  }
  return { deps: [...deps].sort().map(ver), reg: [...reg].sort() };
}

function fileEntry(dir, file, type) {
  return { path: `src/${dir}/${file}`, type, target: `${TARGET_BASE}/${dir}/${file}` };
}

const items = [];
const theme = prevByName.get("theme");
items.push({
  name: "theme",
  type: "registry:style",
  title: theme?.title ?? "Dense technical theme",
  description: theme?.description,
  files: [
    { path: "src/theme.css", type: "registry:file", target: `${TARGET_BASE}/theme.css` },
    { path: "src/base.css", type: "registry:file", target: `${TARGET_BASE}/base.css` },
    ...["Geist-Variable.woff2", "GeistMono-Variable.woff2", "OFL.txt"].map((f) => ({
      path: `src/fonts/${f}`,
      type: "registry:file",
      target: `~/public/fonts/${f}`,
    })),
  ],
});

for (const file of list("lib")) {
  const name = basename(file, extname(file));
  const { deps, reg } = analyze("lib", file);
  items.push({
    name,
    type: "registry:lib",
    title: name,
    ...(deps.length && { dependencies: deps }),
    ...(reg.length && { registryDependencies: reg }),
    files: [fileEntry("lib", file, "registry:lib")],
  });
}

for (const file of list("components")) {
  const name = basename(file, extname(file));
  const { deps, reg } = analyze("components", file);
  items.push({
    name,
    type: "registry:ui",
    title: title(name),
    ...(deps.length && { dependencies: deps }),
    ...(reg.length && { registryDependencies: reg }),
    files: [fileEntry("components", file, "registry:ui")],
  });
}

for (const file of list("marketing")) {
  const base = basename(file, extname(file));
  const name = `marketing-${base}`;
  const { deps, reg } = analyze("marketing", file);
  items.push({
    name,
    type: "registry:block",
    title: `Marketing ${title(base)}`,
    description: "Dense technical marketing block.",
    ...(deps.length && { dependencies: deps }),
    ...(reg.length && { registryDependencies: reg }),
    files: [fileEntry("marketing", file, "registry:component")],
  });
}

for (const i of items) if (i.dependencies && !i.dependencies.length) delete i.dependencies;

const out = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kilo-ui",
  homepage: "https://github.com/KiloAgent/kilo-ui",
  items,
};
writeFileSync(join(ROOT, "registry.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`registry.json: ${items.length} items`);
