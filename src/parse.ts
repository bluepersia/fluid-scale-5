import { DocumentClone, MediaRuleClone } from "./cloner.types";
import { CSSParseResult } from "./parse.types";

const STYLE_RULE_TYPE = 1;
const MEDIA_RULE_TYPE = 4;

export { STYLE_RULE_TYPE, MEDIA_RULE_TYPE };

function parseCSS(doc: DocumentClone): CSSParseResult {
  const breakpoints = new Set<number>();
  let globalBaselineWidth = 375;

  for (const styleSheet of doc.styleSheets) {
    for (const rule of styleSheet.cssRules) {
      if (rule.type === MEDIA_RULE_TYPE) {
        const mediaRule = rule as MediaRuleClone;
        breakpoints.add(mediaRule.minWidth);
        if (mediaRule.cssRules.length === 0)
          globalBaselineWidth = mediaRule.minWidth;
      }
    }
  }

  return {
    breakpoints: Array.from(breakpoints).sort((a, b) => a - b),
  };
}
