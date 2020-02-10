export const defaultHeader = {
  'Content-Type': 'application/json',
  'Accept-Language': 'en-US'
};

export const defaultResponseHeader = { 'Content-Type': 'application/json; charset=utf-8' };
export const defaultRequestHeader = {
  ...defaultHeader,
  Authorization: 'bearer token'
};
