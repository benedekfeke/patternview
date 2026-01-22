export interface AlgorithmState {
  [key: string]: any;
}

export interface OperationResult {
  newState: AlgorithmState;
  explanation: string;
  snippet?: string;
}

export interface AlgorithmHandler {
  initialState: AlgorithmState;
  getExplanation: (state: AlgorithmState) => string;
  handleOperation: (
    operationName: string,
    currentState: AlgorithmState,
    ...params: any[]
  ) => OperationResult;
}
