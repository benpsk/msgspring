export interface ApiResponseEnvelope<TData = unknown, TError = unknown> {
  success: boolean;
  message: string;
  data: TData | null;
  error: TError | null;
}
