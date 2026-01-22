import { AlgorithmHandler, AlgorithmState, OperationResult } from "../algorithm.handler";
import { queueConfig } from "../configs/queue.config";

interface QueueState extends AlgorithmState {
  itemCount: number;
  lastOperation: string | null;
  lastItem: string | null;
}

export const queueHandler: AlgorithmHandler = {
  initialState: {
    itemCount: 1,
    lastOperation: null,
    lastItem: null,
  } as QueueState,

  getExplanation: (state: AlgorithmState): string => {
    const queueState = state as QueueState;
    
    if (queueState.itemCount === 0) {
      return "The queue is empty. You can only perform Enqueue operations.";
    }
    if (queueState.lastOperation === 'Enqueue') {
      return `Added "${queueState.lastItem}" to the rear. Queue now has ${queueState.itemCount} item(s).`;
    }
    if (queueState.lastOperation === 'Dequeue') {
      return `Removed "${queueState.lastItem}" from the front. Queue now has ${queueState.itemCount} item(s).`;
    }
    return `Queue has ${queueState.itemCount} item(s). You can Enqueue or Dequeue.`;
  },

  handleOperation: (
    operationName: string,
    currentState: AlgorithmState,
    ...params: any[]
  ): OperationResult => {
    const state = currentState as QueueState;
    const [itemName] = params; //Unity sends this

    switch (operationName) {
      case 'Enqueue':
        return {
          newState: {
            itemCount: state.itemCount + 1,
            lastOperation: 'Enqueue',
            lastItem: itemName || `Item ${state.itemCount + 1}`,
          },
          explanation: '',
          snippet: queueConfig.pseudocodes.Enqueue?.code,
        };
      case 'Dequeue':
        return {
          newState: {
            itemCount: Math.max(0, state.itemCount - 1),
            lastOperation: 'Dequeue',
            lastItem: itemName || 'unknown',
          },
          explanation: '',
          snippet: queueConfig.pseudocodes.Dequeue?.code,
        };
      default:
        return {newState: state, explanation: 'Unknown operation'};
    }
  }
}
