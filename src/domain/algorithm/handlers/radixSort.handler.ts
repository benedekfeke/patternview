import { AlgorithmHandler, AlgorithmState, OperationResult } from "../algorithm.handler";
import { radixSortConfig } from "../configs/radixSort.config";

interface RadixState extends AlgorithmState {
  phase: 'Idle' | 'Init' | 'SelectDigit' | 'DistributeToBins' | 'CollectFromBins' | 'AdvanceDigit' | 'Done';
  message: string | null;
}

export const radixSortHandler: AlgorithmHandler = {
  initialState: {
    phase: 'Idle',
    message: null,
  } as RadixState,

  getExplanation: (state: AlgorithmState): string => {
    const sortState = state as RadixState;

    switch (sortState.phase) {
      case 'Idle':
        return "Radix Sort processes elements digit by digit, from least significant to most significant. Click to begin sorting.";
      case 'SelectDigit':
        return "Selecting the current digit position to sort by. We start from the rightmost digit and move left.";
      case 'DistributeToBins':
        return "Distributing elements into bins (0-9) based on the current digit. Each element goes into the bin matching its digit value.";
      case 'CollectFromBins':
        return "Collecting elements from bins in order (0 to 9). This maintains the relative order from previous digit passes.";
      case 'AdvanceDigit':
        return "Moving to the next digit position (one place to the left). The process repeats until all digits are processed.";
      case 'Done':
        return "All digits have been processed. The elements are now fully sorted. Click to generate a new set of elements.";
      default:
        return sortState.message || "Ready to sort the elements";
    }
  },

  handleOperation: (operationName: string, currentState: AlgorithmState, ...params: any[]): OperationResult => {
    const state = currentState as RadixState;

    const [payload] = params;

    const mkMessage = (p:any) => (p === undefined || p === null) ? null : (typeof p === 'string' ? p : JSON.stringify(p));

    switch(operationName) {
      // case 'OnRadixStateChanged':
      //   return {
      //     newState: {
      //       ...state,
      //       phase: payload as RadixState['phase'],
      //       message: mkMessage(payload),
      //     },
      //     explanation: '',
      //     snippet: radixSortConfig.pseudocodes.OnRadixStateChanged?.code,
      //     tooltip: radixSortConfig.pseudocodes.OnRadixStateChanged?.tooltip,
      //   }
      case 'OnDigitSelected':
        return {
          newState: {
            ...state,
            phase: 'SelectDigit',
            message: mkMessage(payload),
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnDigitSelected?.code,
          tooltip: radixSortConfig.pseudocodes.OnDigitSelected?.tooltip,
        }
      case 'OnLetterMovedToBin': {
        const {zip, bin} = payload || {}
        return {
          newState: {
            ...state,
            phase: 'DistributeToBins',
            message: zip ? `${zip}|${bin}`:mkMessage(payload),
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnLetterMovedToBin?.code,
          tooltip: radixSortConfig.pseudocodes.OnLetterMovedToBin?.tooltip,
        }
      }
      case 'OnLetterCollected': {
        const {zip, position} = payload || {}
        return {
          newState: {
            ...state,
            phase: 'CollectFromBins',
            message: zip ? `${zip}|${position}` : mkMessage(payload),
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnLetterCollected?.code,
          tooltip: radixSortConfig.pseudocodes.OnLetterCollected?.tooltip,
        }
      }
      case 'OnPassComplete':
        const {current, total} = payload || {}
        return {
          newState: {
            ...state,
            phase: 'AdvanceDigit',
            message: (current !== undefined && total !== undefined) ? `${current}/${total}`: mkMessage(payload),
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnPassComplete?.code,
          tooltip: radixSortConfig.pseudocodes.OnPassComplete?.tooltip,
        }
      case 'OnRadixSortComplete':
        return {
          newState: {
            ...state,
            phase: 'Done',
            message: 'Radix sorting algorithm is done, all letters are sorted.',
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnRadixSortComplete?.code,
          tooltip: radixSortConfig.pseudocodes.OnRadixSortComplete?.tooltip,
        }
      case 'OnLettersInitialized':
        return {
          newState: {
            ...state,
            phase: 'Init',
            message: mkMessage(payload),
          },
          explanation: '',
          snippet: radixSortConfig.pseudocodes.OnLettersInitialized?.code,
          tooltip: radixSortConfig.pseudocodes.OnLettersInitialized?.tooltip,
        }

      default:
        return {newState: {...state,message: mkMessage(payload)}, explanation: mkMessage(payload) || 'Unknown Operation'}
    }
    

  },

}
