import { Program } from './index';
import { Tag } from '../tag';
import { Routine } from '../routine';

describe('Program Class', () => {
  describe('Constructor', () => {
    it('creates program with required parameters', () => {
      const program = new Program({
        name: 'TestProgram'
      });

      expect(Program.isProgram(program)).toBe(true);
    });

    it('creates program with all parameters', () => {
      const program = new Program({
        name: 'TestProgram',
        description: 'Test description',
        safety: true
      });

      const xml = program.toString();
      expect(xml).toContain('Test description');
    });

    it('throws error for invalid name type', () => {
      expect(() => new Program({
        name: 123 as any
      })).toThrow();
    });

    it('throws error for invalid description type', () => {
      expect(() => new Program({
        name: 'TestProgram',
        description: 123 as any
      })).toThrow();
    });
  });

  describe('Tag Management', () => {
    let program: Program;

    beforeEach(() => {
      program = new Program({ name: 'TestProgram' });
    });

    it('adds tag to program', () => {
      const tag = new Tag({
        name: 'ProgramTag',
        datatype: 'BOOL'
      });

      program.addTag(tag);
      const foundTag = program.findTag('ProgramTag');
      
      expect(foundTag).not.toBeNull();
      expect(foundTag?.name).toBe('ProgramTag');
    });

    it('throws error when adding non-Tag object', () => {
      expect(() => program.addTag({} as any)).toThrow();
    });

    it('returns null when tag not found', () => {
      const foundTag = program.findTag('NonExistentTag');
      expect(foundTag).toBeNull();
    });
  });

  describe('Routine Management', () => {
    let program: Program;

    beforeEach(() => {
      program = new Program({ name: 'TestProgram' });
    });

    it('adds routine to program', () => {
      const routine = new Routine({
        name: 'TestRoutine'
      });

      program.addRoutine(routine);
      const xml = program.toString();
      
      expect(xml).toContain('Routines');
      expect(xml).toContain('TestRoutine');
    });
  });

  describe('Static Methods', () => {
    it('isProgram returns true for Program instances', () => {
      const program = new Program({ name: 'Test' });
      expect(Program.isProgram(program)).toBe(true);
    });

    it('isProgram returns false for non-Program objects', () => {
      expect(Program.isProgram({})).toBe(false);
      expect(Program.isProgram(null)).toBe(false);
    });
  });
});
