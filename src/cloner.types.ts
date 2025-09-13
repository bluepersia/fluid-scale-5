type DocumentClone = {
  styleSheets: StyleSheetClone[];
};

type StyleSheetClone = {
  cssRules: CSSRuleClone[];
};

type CSSRuleClone = {
  type: 1 | 4;
};

type StyleRuleClone = {
  type: 1;
  selectorText: string;
  style: Record<string, string>;
  specialProperties: Record<string, string>;
};

type MediaRuleClone = {
  type: 4;
  minWidth: number;
  cssRules: StyleRuleClone[];
};

export type {
  DocumentClone,
  StyleSheetClone,
  CSSRuleClone,
  StyleRuleClone,
  MediaRuleClone,
};
