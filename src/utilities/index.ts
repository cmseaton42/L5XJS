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

export const validateBoolean = (value: unknown, paramName: string): void => {
  if (typeof value !== 'boolean') {
    throw new Error(`${paramName} expected type <boolean> but got <${typeof value}>`);
  }
};

export const validateNumber = (value: unknown, paramName: string): void => {
  if (typeof value !== 'number') {
    throw new Error(`${paramName} expected type <number> but got <${typeof value}>`);
  }
};
