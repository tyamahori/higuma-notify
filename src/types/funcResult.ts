interface BaseFuncResult {
  success: boolean;
}
export interface SuccessFuncResult<T> extends BaseFuncResult {
  success: true;
  message?: string;
  data: T;
}

export interface SuccessFuncNotDataResult extends BaseFuncResult {
  success: true;
  message?: string;
}

export interface FailFuncResult<E> extends BaseFuncResult {
  success: false;
  message: string;
  error?: E;
}

export type FuncResult<T = void, E = unknown> = T extends void
  ? SuccessFuncNotDataResult | FailFuncResult<E>
  : SuccessFuncResult<T> | FailFuncResult<E>;
