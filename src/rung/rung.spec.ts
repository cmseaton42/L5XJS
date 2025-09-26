import { Rung } from './index';

describe('Rung Class', () => {
  describe('Constructor', () => {
    it('creates rung with required parameters', () => {
      const rung = new Rung({
        logic: 'XIC()OTE();'
      });

      expect(Rung.isRung(rung)).toBe(true);
      expect(rung.toString()).toContain('XIC()OTE();');
    });

    it('creates rung with all parameters', () => {
      const rung = new Rung({
        logic: 'XIC(StartButton)OTE(Motor);',
        number: 5,
        comment: 'Start motor logic'
      });

      const xml = rung.toString();
      expect(xml).toContain('XIC(StartButton)OTE(Motor);');
      expect(xml).toContain('Start motor logic');
    });

    it('creates rung with default number', () => {
      const rung = new Rung({
        logic: 'XIC()OTE();'
      });

      expect(rung.toString()).toContain('XIC()OTE();');
    });

    it('throws error for invalid logic type', () => {
      expect(() => new Rung({
        logic: 123 as any
      })).toThrow();
    });

    it('throws error for invalid comment type', () => {
      expect(() => new Rung({
        logic: 'XIC()OTE();',
        comment: 123 as any
      })).toThrow();
    });
  });

  describe('XML Structure', () => {
    it('generates correct XML structure', () => {
      const rung = new Rung({
        logic: 'XIC(Input)OTE(Output);',
        comment: 'Test logic'
      });

      const xml = rung.toString();
      expect(xml).toContain('<Comment>');
      expect(xml).toContain('<Text>');
      expect(xml).toContain('XIC(Input)OTE(Output);');
      expect(xml).toContain('Test logic');
    });

    it('generates XML without comment when not provided', () => {
      const rung = new Rung({
        logic: 'XIC()OTE();'
      });

      const xml = rung.toString();
      expect(xml).toContain('<Text>');
      expect(xml).not.toContain('<Comment>');
    });
  });

  describe('Static Methods', () => {
    it('isRung returns true for Rung instances', () => {
      const rung = new Rung({ logic: 'XIC()OTE();' });
      expect(Rung.isRung(rung)).toBe(true);
    });

    it('isRung returns false for non-Rung objects', () => {
      expect(Rung.isRung({})).toBe(false);
      expect(Rung.isRung(null)).toBe(false);
    });
  });
});
