import { validateString, validateObject } from './index';

describe('Utilities', () => {
  describe('validateString', () => {
    it('passes for valid string values', () => {
      expect(() => validateString('test', 'param')).not.toThrow();
      expect(() => validateString('', 'param')).not.toThrow();
    });

    it('throws error for non-string values', () => {
      expect(() => validateString(123, 'param')).toThrow('param expected type <string> but got <number>');
      expect(() => validateString(null, 'param')).toThrow('param expected type <string> but got <object>');
      expect(() => validateString(undefined, 'param')).toThrow('param expected type <string> but got <undefined>');
      expect(() => validateString([], 'param')).toThrow('param expected type <string> but got <object>');
      expect(() => validateString({}, 'param')).toThrow('param expected type <string> but got <object>');
    });

    it('includes parameter name in error message', () => {
      expect(() => validateString(123, 'testParam')).toThrow('testParam expected type <string>');
    });
  });

  describe('validateObject', () => {
    it('passes for valid object values', () => {
      expect(() => validateObject({}, 'param')).not.toThrow();
      expect(() => validateObject({ key: 'value' }, 'param')).not.toThrow();
      expect(() => validateObject([], 'param')).not.toThrow();
    });

    it('throws error for null values', () => {
      expect(() => validateObject(null, 'param')).toThrow('param expected type <object> but got <object>');
    });

    it('throws error for non-object values', () => {
      expect(() => validateObject('string', 'param')).toThrow('param expected type <object> but got <string>');
      expect(() => validateObject(123, 'param')).toThrow('param expected type <object> but got <number>');
      expect(() => validateObject(undefined, 'param')).toThrow('param expected type <object> but got <undefined>');
    });

    it('includes parameter name in error message', () => {
      expect(() => validateObject('invalid', 'testParam')).toThrow('testParam expected type <object>');
    });
  });
});
