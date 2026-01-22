import { AlgorithmHandler } from "./algorithm.handler";
import { pathfindingHandler } from "./handlers/pathfinding.handler";
import { queueHandler } from "./handlers/queue.handler";

const handlerRegistry: Record<string, AlgorithmHandler> = {
  Queue: queueHandler,
  Pathfinding: pathfindingHandler
}

export function getAlgorithmHandler(sceneName: string): AlgorithmHandler | undefined {
  return handlerRegistry[sceneName];
}
