export const validateString = (value: unknown, paramName: string): void => {
  if (typeof value !== 'string') {
    throw new Error(`${paramName} expected type <string> but got <${typeof value}>`);
  }
};

export const validateObject = (value: unknown, paramName: string): void => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`${paramName} expected type <object> but got <${typeof value}>`);
  }
};
