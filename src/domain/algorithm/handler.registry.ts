import { AlgorithmHandler } from "./algorithm.handler";
import { pathfindingHandler } from "./handlers/pathfinding.handler";
import { queueHandler } from "./handlers/queue.handler";
import { radixSortHandler } from "./handlers/radixSort.handler";

const handlerRegistry: Record<string, AlgorithmHandler> = {
  Queue: queueHandler,
  Pathfinding: pathfindingHandler,
  RadixSort: radixSortHandler,
}

export function getAlgorithmHandler(sceneName: string): AlgorithmHandler | undefined {
  console.log("getting handler...")
  return handlerRegistry[sceneName];
}
