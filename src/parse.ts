import {
  CSSRuleClone,
  DocumentClone,
  MediaRuleClone,
  StyleRuleClone,
  StyleSheetClone,
} from "./cloner.types";
import {
  BatchRuleResult,
  CSSParseResult,
  StyleBatch,
  StyleBatchState,
} from "./parse.types";

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

function parseStyleSheet(
  styleSheet: StyleSheetClone,
  globalBaselineWidth: number
): void {
  const baselineMediaRule = styleSheet.cssRules.find(
    (rule) =>
      rule.type === MEDIA_RULE_TYPE &&
      (rule as MediaRuleClone).cssRules.length === 0
  ) as MediaRuleClone;

  const baselineWidth = baselineMediaRule?.minWidth ?? globalBaselineWidth;
}

function batchStyleSheet(
  styleSheet: StyleSheetClone,
  baselineWidth: number
): StyleBatch[] {
  let styleBatchState: StyleBatchState = {
    currentStyleBatch: null,
    styleBatches: [],
  };

  for (const rule of styleSheet.cssRules) {
    styleBatchState = {
      ...styleBatchState,
      ...batchRule(rule, styleBatchState, baselineWidth),
    };
  }

  return styleBatchState.styleBatches;
}

function batchRule(
  rule: CSSRuleClone,
  styleBatchState: StyleBatchState,
  baselineWidth: number
): StyleBatchState {
  const newStyleBatchState = { ...styleBatchState };

  if (rule.type === STYLE_RULE_TYPE) {
    const styleRule = rule as StyleRuleClone;
    newStyleBatchState.currentStyleBatch = handleNewStyleRuleBatch(
      newStyleBatchState.currentStyleBatch,
      baselineWidth
    );
    newStyleBatchState.currentStyleBatch = {
      ...newStyleBatchState.currentStyleBatch!,
      rules: [...newStyleBatchState.currentStyleBatch!.rules, styleRule],
    };
  } else if (rule.type === MEDIA_RULE_TYPE) {
    newStyleBatchState.currentStyleBatch = null;
    newStyleBatchState.styleBatches.push(
      newMediaRuleBatch(rule as MediaRuleClone)
    );
  }

  return newStyleBatchState;
}

function handleNewStyleRuleBatch(
  currentStyleBatch: StyleBatch | null,
  baselineWidth: number
): StyleBatch | null {
  return (
    currentStyleBatch || {
      width: baselineWidth,
      rules: [],
      isMediaRule: false,
    }
  );
}

function newMediaRuleBatch(mediaRule: MediaRuleClone): StyleBatch {
  return {
    width: mediaRule.minWidth,
    rules: mediaRule.cssRules,
    isMediaRule: true,
  };
}
