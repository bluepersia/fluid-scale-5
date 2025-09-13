import {
  CSSRuleClone,
  DocumentClone,
  MediaRuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner.types";
import { STYLE_RULE_TYPE, MEDIA_RULE_TYPE } from "./parse";

const FLUID_PROPERTY_NAMES = new Set<string>([
  "font-size",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "text-indent",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
  "width",
  "min-width",
  "max-width",
  "height",
  "min-height",
  "max-height",
  "grid-template-columns",
  "grid-template-rows",
  "background-position-x",
  "background-position-y",
  "--fluid-bg-size",
  "top",
  "left",
  "right",
  "bottom",
  "column-gap",
  "row-gap",
]);

function cloneDocument(doc: Document): DocumentClone {
  const docClone: DocumentClone = {
    styleSheets: [],
  };

  for (const styleSheet of Array.from(doc.styleSheets))
    docClone.styleSheets.push(cloneStyleSheet(styleSheet));

  return docClone;
}

function cloneStyleSheet(styleSheet: CSSStyleSheet): StyleSheetClone {
  const styleSheetClone: StyleSheetClone = {
    cssRules: [],
  };

  for (const rule of Array.from(styleSheet.cssRules)) {
    const ruleClone = cloneRule(rule);
    if (ruleClone) {
      styleSheetClone.cssRules.push(ruleClone);
    }
  }

  return styleSheetClone;
}

function cloneRule(rule: CSSRule): CSSRuleClone | null {
  if (rule.type === STYLE_RULE_TYPE) {
    return cloneStyleRule(rule as CSSStyleRule);
  } else if (rule.type === MEDIA_RULE_TYPE) {
    const mediaRule = rule as CSSMediaRule;
    // Regex explanation: matches (min-width: <number>px)
    const match = mediaRule.media.mediaText.match(/\(min-width:\s*(\d+)px\)/);

    if (match) {
      return {
        type: MEDIA_RULE_TYPE,
        minWidth: Number(match[1]),
        cssRules: Array.from(mediaRule.cssRules).map((rule) =>
          cloneStyleRule(rule as CSSStyleRule)
        ),
      } as MediaRuleClone;
    }
    return null;
  }
  return null;
}

function cloneStyleRule(styleRule: CSSStyleRule): StyleRuleClone {
  const styleRuleClone: StyleRuleClone = {
    type: STYLE_RULE_TYPE,
    selectorText: styleRule.selectorText,
    style: {},
    specialProperties: {},
  };
  for (const property in styleRule.style) {
    if (FLUID_PROPERTY_NAMES.has(property)) {
      styleRuleClone.style[property] = styleRule.style[property];
    }
  }
  return styleRuleClone;
}

export { cloneDocument, cloneStyleSheet, cloneRule, cloneStyleRule };
