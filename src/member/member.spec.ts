import { Member } from './index';

describe('Member Class', () => {
  describe('New Instance', () => {
    it('Accepts Proper Input', () => {
      const fn = (options: any) => () => new Member(options);

      expect(fn({ datatype: 'DINT' })).toThrow();
      expect(fn({ name: null, datatype: 'DINT' })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT' })).not.toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 12 })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description' })).not.toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: 12 })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true })).not.toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true, target: 12 })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true, target: 'aTarget' })).not.toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true, target: 'aTarget', bitNumber: 'notANumber' })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true, bitNumber: 12 })).toThrow();
      expect(fn({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true, target: 'aTarget', bitNumber: 12 })).not.toThrow();
    });

    it('Initializes with Desired Document Model', () => {
      let mem = new Member({ name: 'tagName', datatype: 'DINT' });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'BOOL', target: 'aTarget', bitNumber: 0 });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'BIT', target: 'aTarget', bitNumber: 0 });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'DINT', description: 'A Description' });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: true });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: false, target: 'ATarget' });
      expect(mem).toMatchSnapshot();

      mem = new Member({ name: 'tagName', datatype: 'DINT', description: 'A Description', hidden: false, target: 'ATarget', bitNumber: 12 });
      expect(mem).toMatchSnapshot();
    });
  });

  describe('Static Methods', () => {
    test('isMember: Returns Appropriate Judgement', () => {
      let mem = new Member({ name: 'tagName', datatype: 'DINT' });
      expect(Member.isMember(mem)).toBeTruthy();

      const notMember = { notATag: 12 };
      expect(Member.isMember(notMember)).toBeFalsy();

      expect(Member.isMember(12)).toBeFalsy();
    });
  });
});
