export type Status = 'idle' | 'loading' | 'success' | 'error';

export class DataWithStatus<T> {
  constructor(
    public data: T | null = null,
    public status: Status = 'idle',
    public error: string | null = null,
  ) {}

  static idle<T>(): DataWithStatus<T> {
    return new DataWithStatus<T>();
  }

  static loading<T>(previousData: T | null = null): DataWithStatus<T> {
    return new DataWithStatus<T>(previousData, 'loading');
  }

  static success<T>(data: T): DataWithStatus<T> {
    return new DataWithStatus<T>(data, 'success');
  }

  static error<T>(message: string): DataWithStatus<T> {
    return new DataWithStatus<T>(null, 'error', message);
  }
}
