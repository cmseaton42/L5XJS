import { Routine } from './index';
import { Rung } from '../rung';

describe('Routine Class', () => {
  describe('Constructor', () => {
    it('creates routine with required parameters', () => {
      const routine = new Routine({
        name: 'TestRoutine'
      });

      expect(Routine.isRoutine(routine)).toBe(true);
      expect(routine.toString()).toContain('RLLContent');
    });

    it('creates routine with all parameters', () => {
      const routine = new Routine({
        name: 'TestRoutine',
        description: 'Test description',
        type: 'RLL'
      });

      const xml = routine.toString();
      expect(xml).toContain('Test description');
      expect(xml).toContain('RLLContent');
    });

    it('throws error for invalid name type', () => {
      expect(() => new Routine({
        name: 123 as any
      })).toThrow();
    });

    it('throws error for invalid description type', () => {
      expect(() => new Routine({
        name: 'TestRoutine',
        description: 123 as any
      })).toThrow();
    });
  });

  describe('Rung Management', () => {
    let routine: Routine;

    beforeEach(() => {
      routine = new Routine({ name: 'TestRoutine' });
    });

    it('adds rung to routine', () => {
      const rung = new Rung({
        logic: 'XIC()OTE();'
      });

      routine.addRung(rung);
      const xml = routine.toString();
      
      expect(xml).toContain('XIC()OTE();');
      expect(xml).toContain('Number="0"');
    });

    it('adds multiple rungs with correct numbering', () => {
      const rung1 = new Rung({ logic: 'XIC()OTE(Tag1);' });
      const rung2 = new Rung({ logic: 'XIC()OTE(Tag2);' });

      routine.addRung(rung1);
      routine.addRung(rung2);
      
      const xml = routine.toString();
      expect(xml).toContain('Number="0"');
      expect(xml).toContain('Number="1"');
    });
  });

  describe('Static Methods', () => {
    it('isRoutine returns true for Routine instances', () => {
      const routine = new Routine({ name: 'Test' });
      expect(Routine.isRoutine(routine)).toBe(true);
    });

    it('isRoutine returns false for non-Routine objects', () => {
      expect(Routine.isRoutine({})).toBe(false);
      expect(Routine.isRoutine(null)).toBe(false);
    });
  });
});
