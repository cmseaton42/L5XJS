import { Element } from './index';

describe('Element Class', () => {
  describe('Constructor', () => {
    it('creates element with valid document tree', () => {
      const element = new Element({
        type: 'element',
        name: 'TestElement',
        elements: []
      });

      expect(Element.isElement(element)).toBe(true);
    });

    it('throws error for invalid document tree type', () => {
      expect(() => new Element('invalid' as any)).toThrow();
      expect(() => new Element(123 as any)).toThrow();
      expect(() => new Element(null as any)).toThrow();
    });
  });

  describe('DOM Access', () => {
    it('provides access to DOM structure', () => {
      const tree = {
        type: 'element',
        name: 'TestElement',
        attributes: { Name: 'Test' },
        elements: []
      };

      const element = new Element(tree);
      expect(element.dom).toEqual(tree);
    });
  });

  describe('Find Methods', () => {
    let element: Element;

    beforeEach(() => {
      element = new Element({
        type: 'element',
        name: 'Root',
        elements: [
          {
            type: 'element',
            name: 'Tag',
            attributes: { Name: 'Tag1', DataType: 'BOOL' },
            elements: []
          },
          {
            type: 'element',
            name: 'Tag',
            attributes: { Name: 'Tag2', DataType: 'DINT' },
            elements: []
          },
          {
            type: 'element',
            name: 'Program',
            attributes: { Name: 'MainProgram' },
            elements: []
          }
        ]
      });
    });

    describe('findOne', () => {
      it('finds first element by type', () => {
        const found = element.findOne('Tag');
        expect(found).not.toBeNull();
        expect(found?.attributes?.Name).toBe('Tag1');
      });

      it('finds element by type and attributes', () => {
        const found = element.findOne('Tag', { Name: 'Tag2' });
        expect(found).not.toBeNull();
        expect(found?.attributes?.Name).toBe('Tag2');
      });

      it('returns null when element not found', () => {
        const found = element.findOne('NonExistent');
        expect(found).toBeNull();
      });

      it('throws error for invalid type parameter', () => {
        expect(() => element.findOne(123 as any)).toThrow();
      });

      it('throws error for invalid attributes parameter', () => {
        expect(() => element.findOne('Tag', 'invalid' as any)).toThrow();
      });

      it('throws error for invalid ignore parameter', () => {
        expect(() => element.findOne('Tag', undefined, 'invalid' as any)).toThrow();
      });
    });

    describe('findAll', () => {
      it('finds all elements by type', () => {
        const found = element.findAll('Tag');
        expect(found).toHaveLength(2);
        expect(found[0].attributes?.Name).toBe('Tag1');
        expect(found[1].attributes?.Name).toBe('Tag2');
      });

      it('finds elements by type and attributes', () => {
        const found = element.findAll('Tag', { DataType: 'BOOL' });
        expect(found).toHaveLength(1);
        expect(found[0].attributes?.Name).toBe('Tag1');
      });

      it('returns empty array when no elements found', () => {
        const found = element.findAll('NonExistent');
        expect(found).toEqual([]);
      });

      it('ignores specified element names', () => {
        const found = element.findAll('Tag', undefined, ['Tag']);
        expect(found).toEqual([]);
      });
    });
  });

  describe('XML Generation', () => {
    it('converts element to XML string', () => {
      const element = new Element({
        type: 'element',
        name: 'TestElement',
        attributes: { Name: 'Test' },
        elements: [{
          type: 'element',
          name: 'Child',
          elements: []
        }]
      });

      const xml = element.toString();
      expect(xml).toContain('<Child');
      expect(typeof xml).toBe('string');
    });
  });

  describe('Static Methods', () => {
    it('isElement returns true for Element instances', () => {
      const element = new Element({ type: 'element', name: 'Test' });
      expect(Element.isElement(element)).toBe(true);
    });

    it('isElement returns false for non-Element objects', () => {
      expect(Element.isElement({})).toBe(false);
      expect(Element.isElement(null)).toBe(false);
    });
  });
});
