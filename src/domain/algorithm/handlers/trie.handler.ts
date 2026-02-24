import { handleClientScriptLoad } from "next/script";
import { AlgorithmHandler, AlgorithmState, OperationResult } from "../algorithm.handler";
import { trieConfig } from "../configs/trie.config";

interface TrieState extends AlgorithmState {
  phase: 'level0' | 'level1' | 'level2' | 'level3' | 'complete';
  message: string | null;
}

export const trieHandler: AlgorithmHandler = {
  initialState: {
    phase: 'level0',
    message: null,
  } as TrieState,

  getExplanation: (state: AlgorithmState): string => {
    const currentState = state as TrieState;

    switch(currentState.phase) {
      case 'level0':
        return "Trie searches for value at index 0. This means that it will go down the tree until it does not find it."
      case 'level1':
        return "Similarly, it searches for the value at index 1, but goes only through the subtrees of the value at the parent index, i.e. level 0"
      case 'level2':
        return "The Trie advances an index further, searching for the value at index 2, under the parent element, index 1."
      case 'level3':
        return "For the sake of simplicity, the 4th level - 4th index, is the last one, it works on the same principle."
      case 'complete':
        return "The target has been found."
      default:
        return currentState.message || "Ready to find the target.";
    };
  },
  handleOperation: (operationName: string, currentState: AlgorithmState, ...params: any[]): OperationResult => {
    const state = currentState as TrieState;
    const [payload, extraData] = params;

    switch(operationName) {
      case 'OnShelfSelected':
        return {
          newState: {
            phase: 'level1',
            message: payload
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnShelfSelected?.code,
          tooltip: trieConfig.pseudocodes.OnShelfSelected?.tooltip,
        };
      case 'OnColumnSelected':
        return {
          newState: {
            phase: 'level2',
            message: payload
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnColumnSelected?.code,
          tooltip: trieConfig.pseudocodes.OnColumnSelected?.tooltip,
        };
      case 'OnRowSelected':
        return {
          newState: {
            phase: 'level3',
            message: payload
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnRowSelected?.code,
          tooltip: trieConfig.pseudocodes.OnRowSelected?.tooltip,
        };
      case 'OnBookSelected': {
        let letter = '';
        let depthIndex = '';
        try {
          const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
          letter = String(parsed?.letter ?? '');
          depthIndex = String(parsed?.depthIndex ?? '');
        } catch {
          letter = String(payload ?? '');
          depthIndex = String(payload ?? '');
        }

        return {
          newState: {
            phase: 'complete',
            message: `${letter} ${depthIndex}`.trim(),
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnBookSelected?.code,
          tooltip: trieConfig.pseudocodes.OnBookSelected?.tooltip,
        };
      }
      case 'OnAuthorFound':
        let authorName = '';
        try {
          const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
          const firstName = String(parsed?.firstName ?? '');
          const lastName = String(parsed?.lastName ?? '');
          authorName = `${firstName} ${lastName}`.trim();
        } catch {
          authorName = String(payload ?? '');
        }
        return {
          newState: {
            ...state,
            message: authorName
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnAuthorFound?.code,
          tooltip: trieConfig.pseudocodes.OnAuthorFound?.tooltip,
        };
      case 'OnHintChildren':
        return {
          newState: {
            ...state,
            message: payload.join(', '),
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnHintChildren?.code,
          tooltip: trieConfig.pseudocodes.OnHintChildren?.tooltip,
        };
      case 'OnAuthorRandomized':
        return {
          newState: {
            phase: 'level0',
            message: JSON.stringify(payload)
          },
          explanation: '',
          snippet: trieConfig.pseudocodes.OnAuthorRandomized?.code,
          tooltip: trieConfig.pseudocodes.OnAuthorRandomized?.tooltip,
        };
      default:
        return {
          newState: state, explanation: payload || 'Unknown operation'};
    };           
  }
}
