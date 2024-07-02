export type ApiResponse<T> = {
  errors?: string[];
  get: string;
  level: string;
  message: string;
  paging: Page;
  parameters: Record<string, string>;
  response: Array<T>;
  results: number;
  timestamp: number;
};

type Page = {
  current: number;
  total: number;
};
