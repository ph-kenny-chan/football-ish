export type ApiResponse<T, R> = {
  errors?: string[];
  get: string;
  level: string;
  message: string;
  paging: Page;
  parameters: Record<string, string>;
  response: R;
  results: number;
  timestamp: number;
};

type Page = {
  current: number;
  total: number;
};
