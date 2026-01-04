export interface DescriptionSegment {
  text: string;
  link?: string;
}

export interface Pseudocode {
  title: string;
  code: string;
}

export interface ExplanationRules {
  empty: string;
  hasItems: string;
  default: string;
}

export interface AlgorithmConfig {
  sceneName: string;
  title: string;
  description: string;
  modalDescription?: DescriptionSegment[];
  operations: string[];
  pseudocodes: Pseudocode[];
  explanationRules?: ExplanationRules;
}
