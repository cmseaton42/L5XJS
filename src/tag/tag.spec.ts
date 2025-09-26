import { Tag } from './index';

describe('Tag Class', () => {
  describe('Constructor', () => {
    it('creates tag with required parameters', () => {
      const tag = new Tag({
        name: 'TestTag',
        datatype: 'BOOL'
      });

      expect(tag.name).toBe('TestTag');
      expect(tag.datatype).toBe('BOOL');
    });

    it('creates tag with all parameters', () => {
      const tag = new Tag({
        name: 'TestTag',
        datatype: 'DINT',
        description: 'Test description',
        alias: 'AliasTag',
        safety: true,
        dimension: 10
      });

      expect(tag.name).toBe('TestTag');
      expect(tag.datatype).toBe('DINT');
      expect(tag.description).toBe('Test description');
    });

    it('throws error for invalid name type', () => {
      expect(() => new Tag({
        name: 123 as any,
        datatype: 'BOOL'
      })).toThrow();
    });

    it('throws error for invalid datatype', () => {
      expect(() => new Tag({
        name: 'TestTag',
        datatype: null as any
      })).toThrow();
    });
  });

  describe('Static Methods', () => {
    it('isTag returns true for Tag instances', () => {
      const tag = new Tag({ name: 'Test', datatype: 'BOOL' });
      expect(Tag.isTag(tag)).toBe(true);
    });

    it('isTag returns false for non-Tag objects', () => {
      expect(Tag.isTag({})).toBe(false);
      expect(Tag.isTag(null)).toBe(false);
    });
  });
});
