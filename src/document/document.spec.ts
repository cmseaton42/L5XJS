import { Document } from './index';
import { Tag } from '../tag';

describe('Document Class', () => {
  describe('Constructor', () => {
    it('creates new document without filepath', () => {
      const doc = new Document();
      expect(Document.isDocument(doc)).toBe(true);
      expect(doc.toString()).toContain('RSLogix5000Content');
    });

    it('throws error for invalid filepath type', () => {
      expect(() => new Document(123 as any)).toThrow();
    });
  });

  describe('Tag Management', () => {
    let doc: Document;

    beforeEach(() => {
      doc = new Document();
    });

    it('adds tag to document', () => {
      const tag = new Tag({
        name: 'TestTag',
        datatype: 'BOOL'
      });

      doc.addTag(tag);
      const tags = doc.getTags();
      
      expect(tags).toHaveLength(1);
      expect(tags[0].name).toBe('TestTag');
    });

    it('throws error when adding non-Tag object', () => {
      expect(() => doc.addTag({} as any)).toThrow();
    });

    it('retrieves all tags from document', () => {
      const tag1 = new Tag({ name: 'Tag1', datatype: 'BOOL' });
      const tag2 = new Tag({ name: 'Tag2', datatype: 'DINT' });

      doc.addTag(tag1);
      doc.addTag(tag2);

      const tags = doc.getTags();
      expect(tags).toHaveLength(2);
      expect(tags.map(t => t.name)).toEqual(['Tag1', 'Tag2']);
    });
  });

  describe('XML Generation', () => {
    it('generates valid XML string', () => {
      const doc = new Document();
      const xml = doc.toString();
      
      expect(xml).toContain('<?xml');
      expect(xml).toContain('RSLogix5000Content');
      expect(xml).toContain('Controller');
    });
  });

  describe('Static Methods', () => {
    it('isDocument returns true for Document instances', () => {
      const doc = new Document();
      expect(Document.isDocument(doc)).toBe(true);
    });

    it('isDocument returns false for non-Document objects', () => {
      expect(Document.isDocument({})).toBe(false);
      expect(Document.isDocument(null)).toBe(false);
    });
  });
});
