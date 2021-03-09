interface SuccessResponse<T> {
  data: T;
  message: string;
  code: number;
}

interface ErrorResponse<T> {
  errors: T;
  message: string;
  code: number;
}
