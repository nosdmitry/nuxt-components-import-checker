const fs = require("fs");
const path = require("path");
const glob = require("glob");

const PATH = "../dprofile";

const ignoreTags = ["nuxt-link", "client-only", "portal-target"];

const projectPath = path.resolve(__dirname, PATH); 
const vueFiles = glob.sync(`${projectPath}/**/*.vue`);

const toKebabCase = (str) => {
  if (!str) {
    return;
  }
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

const showNotImportedComponent = (file) => {
  const content = fs.readFileSync(file, "utf-8");

  // Template
  const templateMatch = content.match(/<template[\s\S]*?<\/template>/i);
  if (!templateMatch) return;

  const templateContent = templateMatch[0];

  const regexComp = /<([a-z0-9]+-[a-z0-9-]+)\b/g;
  const regMathces = templateContent.matchAll(regexComp);

  // Преобразуем итератор в массив и удаляем дубликаты
  const usedComponents = Array.from(new Set(Array.from(regMathces, (match) => match[1]).filter((comp) => !ignoreTags.includes(comp))));

  // Script
  const scriptMatch = content.match(/<script[\s\S]*?<\/script>/i);
  if (!scriptMatch) return;

  const scriptContent = scriptMatch[0];

  // only imports regefs
  const regex = /import\s+(\w+)\s+from\s+['"][^'"]+['"]/g;

  // dynamic imports
  const matches = scriptContent.matchAll(regex);

  const importedComponents = new Set(Array.from(matches, (match) => toKebabCase(match[1])));
  
  const missingComponents = [...usedComponents].filter((component) => {
    return !importedComponents.has(component);
  });

  if (missingComponents.length > 0) {
    console.log(`Файл: ${file}`);
    console.log("Неимпортированные компоненты (kebab-case):", missingComponents);
    console.log("---");
  }
}

vueFiles.forEach((file) => {
  showNotImportedComponent(file)
});
