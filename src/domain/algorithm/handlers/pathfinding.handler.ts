import { AlgorithmHandler, AlgorithmState, OperationResult } from "../algorithm.handler";
import { pathfindingConfig } from "../configs/pathfinding.config";

interface PathfindingState extends AlgorithmState {
  phase: 'player' | 'idle' | 'searching' | 'playerFound' | 'algoFound' | -100 | 'comparison';
  nodesVisited: number;
  PlayerPathLength: number | null;
  AlgoPathLength: number | null;
  currentAlgorithm: string | null;
  message: string | null;
}

export const pathfindingHandler: AlgorithmHandler = {
  initialState: {
    phase: 'player',
    nodesVisited: 0,
    PlayerPathLength: null,
    AlgoPathLength: null,
    currentAlgorithm: null,
    message: null,
  } as PathfindingState,

  getExplanation: (state: AlgorithmState): string => {
    const pfState = state as PathfindingState;

    switch (pfState.phase) {
      case 'player':
        return "Graph is generated, find the goal node"
      case 'idle':
        return "Press 'Space' to step forward";
      case 'searching':
        return `Searching... Visited ${pfState.nodesVisited} nodes using ${pfState.currentAlgorithm}`;
      case 'playerFound':
        return `Found a path with length ${pfState.PlayerPathLength}`;
      case 'algoFound':
        return `Found the shortest path with length ${pfState.DijkstraPathLength}`;
      case -100:
        return `No path found from start to goal node.`;
      default:
        return pfState.message || "Ready to find the shortest path";
    }
  },

  handleOperation: (
    operationName: string,
    currentState: AlgorithmState,
    ...params: any[]
  ): OperationResult => {
    const state = currentState as PathfindingState;

    //Unity sends this
    const [message, extraData] = params;

    switch(operationName) {
      case 'OnSceneRestarted':
        return {
          newState: {
            phase: 'idle',
            nodesVisited:0,
            pathLength: null,
            currentAlgorithm: null,
            message: null,
          },
          explanation: '',
          snippet: pathfindingConfig.pseudocodes.OnSceneRestarted?.code,
        };
      case 'OnGraphRandomized':
        return {
          newState: {
            phase: 'idle',
            nodesVisited:0,
            pathLength: null,
            message: `Generated new graph`,
          },
          explanation: '',
          snippet: pathfindingConfig.pseudocodes.OnGraphRandomized?.code,
        };
      case 'OnStepForward':
        return {
          newState: {
            phase: 'searching',
            nodesVisited: state.nodesVisited + 1,
            currentAlgorithms: 'Dijkstra',
            message: message,
          },
          explanation: '',
          snippet: pathfindingConfig.pseudocodes.OnStepForward?.code,
        };
      case 'OnNoPathExists':
        return {
          newState: {
            ...state,
            phase: -100,
            message: "path could not be found",
          },
          explanation: '',
          snippet: pathfindingConfig.pseudocodes.OnNoPathExists?.code,
        }
        case 'OnAlgoPathFound':
          return {
            newState: {
              ...state,
              phase: 'algoFound',
              AlgoPathLength: message,
            },
            explanation: '',
            snippet: pathfindingConfig.pseudocodes.OnAlgoPathFound?.code,
          }
        case 'OnPlayerPathFound':
          return {
            newState: {
              ...state,
              phase: 'playerFound',
              PlayerPathLength: message,
            },
            explanation: '',
            snippet: pathfindingConfig.pseudocodes.OnPlayerPathFound?.code,
          }
        case 'PathsComparison':
          return {
            newState: {
              ...state,
              phase: 'comparison',
              message: message,
            },
            explanation: '',
            snippet: "Comparing your solution (greedy approach, see Description) vs algorithm solution (Unified cost search, Dijkstra's algorithm..."
          }
      default:
        return {newState: state, explanation: message || 'Unknown operation'};
    }
  }

}
