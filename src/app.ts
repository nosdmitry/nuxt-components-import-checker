const fs = require("fs");
const path = require("path");
const glob = require("glob");

const COMPONENTS_PATH = ".";

interface ComponentOptions {
  regexComp: RegExp[];
  regexTemplate: RegExp;
  content: any;
}

const REGEX_TEMPLATE = /<template[\s\S]*?<\/template>/i;
const REGEX_IMPORTS = /<script[\s\S]*?<\/script>/i;
const REGEX_CEBABCASE = /[A-Z]+(?![a-z])|[A-Z]/g;
const REGEX_COMPONENT = [
  /<([a-z0-9]+-[a-z0-9-]+)\b/g,
  /import\s+(\w+)\s+from\s+['"][^'"]+['"]/g,
  /const (\w+) = defineAsyncComponent\(\(\) => import\('[^']+'\)\);?/g,
];

const ignoreTags = ["client-only", "nuxt-link"];

const toCebabCase = (str: string) => str.replace(REGEX_CEBABCASE, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

const getStringByRegexp = (regex: RegExp, template: string) => {
  const regMathces = template.matchAll(regex);
  const usedComponentsList = Array.from(regMathces, (match) => toCebabCase(match[1]));
  return usedComponentsList.filter((comp) => !ignoreTags.includes(comp));
};

const getComponentNames = ({ regexComp, regexTemplate, content }: ComponentOptions): null | string[] => {
  const templateMatch = content.match(regexTemplate);
  if (!templateMatch) {
    return null;
  }

  const templateContent = templateMatch[0];

  const components: string[] = [];

  regexComp.forEach((regex) => {
    const usedComponentsList = getStringByRegexp(regex, templateContent);
    components.push(...usedComponentsList);
  });

  return Array.from(new Set(components));
};

const showNotImportedComponents = (file: any, content: any) => {
  const componentListTemplate = getComponentNames({ regexComp: REGEX_COMPONENT, regexTemplate: REGEX_TEMPLATE, content });

  if (!componentListTemplate) {
    return;
  }

  const componentListScript = getComponentNames({ regexComp: REGEX_COMPONENT, regexTemplate: REGEX_IMPORTS, content });

  componentListTemplate.forEach((component) => {
    const isImported = componentListScript?.includes(component);
    if (isImported) {
      return;
    }

    console.log("File path:", file);
    console.log("Missing components:", component);
    console.log("---");
  });
};

const checkFilesAllFiles = () => {
  const vueFiles = glob.sync(`${COMPONENTS_PATH}/**/*.vue`);
  vueFiles.forEach((file: any) => {
    const content = fs.readFileSync(file, "utf-8");
    showNotImportedComponents(file, content);
  });
};

checkFilesAllFiles();
