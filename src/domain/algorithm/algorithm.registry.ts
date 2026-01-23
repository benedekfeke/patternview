import { AlgorithmConfig } from "./algorithm.types";
import { pathfindingConfig } from "./configs/pathfinding.config";
import { queueConfig } from "./configs/queue.config";
import { radixSortConfig } from "./configs/radixSort.config";


export const algorithmRegistry: Record<string, AlgorithmConfig> = {
  queue: queueConfig,
  pathfinding: pathfindingConfig,
  radixSort: radixSortConfig,
};

export function getAlgorithmConfig(slug: string): AlgorithmConfig | undefined {
  return algorithmRegistry[slug];
}

export function getAllAlgorithmSlugs(): string[] {
  return Object.keys(algorithmRegistry);
}
