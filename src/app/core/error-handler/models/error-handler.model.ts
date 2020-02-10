export interface ResponseError {
  // error?: { message?: string; extendedCode?: string };
  status: number;
  detail: string;
  type: string;
  title: string;
  instance: string;
}
