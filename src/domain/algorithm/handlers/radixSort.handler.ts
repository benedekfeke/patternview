import { AlgorithmHandler, AlgorithmState, OperationResult } from "../algorithm.handler";

interface RadixState extends AlgorithmState {
  phase: 'idle' | 'selectDigit' | 'distributeToBins' | 'collectFromBins' | 'advanceDigit' | 'done';
  message: string | null;
}

export const radixSortHandler: AlgorithmHandler = {
  initialState: {
    phase: 'idle',
    message: null,
  } as RadixState,

  getExplanation: (state: AlgorithmState): string => {
    const sortState = state as RadixState;

    switch (sortState.phase) {
      case 'idle':
        return "Radix Sort processes elements digit by digit, from least significant to most significant. Click to begin sorting.";
      case 'selectDigit':
        return "Selecting the current digit position to sort by. We start from the rightmost digit and move left.";
      case 'distributeToBins':
        return "Distributing elements into bins (0-9) based on the current digit. Each element goes into the bin matching its digit value.";
      case 'collectFromBins':
        return "Collecting elements from bins in order (0 to 9). This maintains the relative order from previous digit passes.";
      case 'advanceDigit':
        return "Moving to the next digit position (one place to the left). The process repeats until all digits are processed.";
      case 'done':
        return "All digits have been processed. The elements are now fully sorted. Click to generate a new set of elements.";
      default:
        return sortState.message || "Ready to sort the elements";
    }
  },

  handleOperation: (operationName: string, currentState: AlgorithmState, ...params: any[]): OperationResult => {
    const state = currentState as RadixState;

    const [message, extraData] = params;

    switch(operationName) {
      default:
        return {newState: {phase: 'idle'}, explanation: message || 'Unknown Operation'}
    }
    

  },

}
