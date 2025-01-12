const content = `
<template>
  <div>
    <section-base />
    <main-section-sticky />
    <client-only />
    <template>
      <main-button>
        <form>
          <lable>
            <grid-content />
          </lable>
        </form>
      </main-button>
    </template>
  </div>
</template>

<script>
import SectionBase from '~/section-base.vue';
import Gridcontent from '/vue';
</script>
`

interface ComponentOptions {
  regexComp: RegExp[];
  regexTemplate: RegExp
}

const REGEX_COMPONENT = [/<([a-z0-9]+-[a-z0-9-]+)\b/g, /import\s+(\w+)\s+from\s+['"][^'"]+['"]/g]
const REGEX_TEMPLATE = /<template[\s\S]*?<\/template>/i;
const REGEX_IMPORTS = /<script[\s\S]*?<\/script>/i;
const REGEX_CEBABCASE = /[A-Z]+(?![a-z])|[A-Z]/g

const ignoreTags = ['client-only'];

const toCebabCase = (str: string) => str.replace(REGEX_CEBABCASE, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

const getStringByRegexp = (regex: RegExp, template: string) => {
  const regMathces = template.matchAll(regex);
  const usedComponentsList = Array.from(regMathces, (match) => toCebabCase(match[1]))
  return usedComponentsList.filter((comp) => !ignoreTags.includes(comp));
}

const getComponentNames = ({ regexComp, regexTemplate }: ComponentOptions): null | string[] => {
  const templateMatch = content.match(regexTemplate);
  if (!templateMatch) {
    return null;
  }

  const templateContent = templateMatch[0];

  const components: string[] = [];

  regexComp.forEach((regex) => {
    const usedComponentsList = getStringByRegexp(regex, templateContent);
    components.push(...usedComponentsList);
  })

  return Array.from(new Set(components));
}

const showNotImportedComponents = () => {
  const componentListTemplate = getComponentNames({regexComp: REGEX_COMPONENT, regexTemplate: REGEX_TEMPLATE});
  console.log(componentListTemplate)

  if (!componentListTemplate) {
    return;
  }

  const componentListScript = getComponentNames({regexComp: REGEX_COMPONENT, regexTemplate: REGEX_IMPORTS});
  console.log(componentListScript)

  componentListTemplate.forEach((component) => {
    const isImported = componentListScript?.includes(component);
    if (isImported) {
      return;
    }

    console.log("Missing components:", component);
    console.log("---");
  })
}

showNotImportedComponents();
