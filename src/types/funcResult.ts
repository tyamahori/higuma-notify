interface BaseFuncResult {
  success: boolean;
}

export interface SuccessFuncResult extends BaseFuncResult {
  success: true;
  message?: string;
}

export interface FailFuncResult extends BaseFuncResult {
  success: false;
  message: string;
}

export type FuncResult = SuccessFuncResult | FailFuncResult;
