export interface DataWithStatus<T> {
  success: boolean;
  loading: boolean;
  error: boolean;
  data: T;
  message?: string;
}
