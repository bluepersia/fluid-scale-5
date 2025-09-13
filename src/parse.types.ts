import { Style } from "util";
import { StyleRuleClone } from "./cloner.types";

type CSSParseResult = {
  breakpoints: number[];
};

type StyleBatch = {
  width: number;
  rules: StyleRuleClone[];
  isMediaRule: boolean;
};

type StyleBatchState = {
  currentStyleBatch: StyleBatch | null;
  styleBatches: StyleBatch[];
};

type BatchRuleResult = {
  styleBatch: StyleBatch | null;
  styleRule: StyleRuleClone | null;
};
export type { CSSParseResult, StyleBatch, StyleBatchState, BatchRuleResult };
