export interface BaseResponse<T> {
  isSuccess: boolean;
  data: T;
  errorMessage: string;
}
