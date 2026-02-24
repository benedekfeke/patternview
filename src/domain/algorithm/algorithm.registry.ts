import { AlgorithmConfig } from "./algorithm.types";
import { pathfindingConfig } from "./configs/pathfinding.config";
import { queueConfig } from "./configs/queue.config";
import { radixSortConfig } from "./configs/radixSort.config";
import { trieConfig } from "./configs/trie.config";


export const algorithmRegistry: Record<string, AlgorithmConfig> = {
  queue: queueConfig,
  pathfinding: pathfindingConfig,
  radixSort: radixSortConfig,
  trie: trieConfig,
};

export function getAlgorithmConfig(slug: string): AlgorithmConfig | undefined {
  return algorithmRegistry[slug];
}

export function getAllAlgorithmSlugs(): string[] {
  return Object.keys(algorithmRegistry);
}
