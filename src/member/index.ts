import { Element } from '../element';
import { validateString, validateObject, validateBoolean, validateNumber } from '../utilities';
import { XmlElement, MemberOptions } from '../types';

export class Member extends Element {
  constructor(options: MemberOptions) {
    validateObject(options, 'Member options');
    
    const { name, datatype, description, hidden = false, target, bitNumber } = options;

    validateString(name, 'Member name');
    validateString(datatype, 'Member datatype');
    
    if (description !== undefined) validateString(description, 'Member description');
    if (hidden !== undefined) validateBoolean(hidden, 'Member hidden');
    if (target !== undefined) validateString(target, 'Member target');
    if (bitNumber !== undefined) validateNumber(bitNumber, 'Member bitNumber');
    
    if (bitNumber !== undefined && !target) {
      throw new Error('bit_number can only be defined with valid target name');
    }

    const attributes: Record<string, string | number | boolean> = {
      Name: name,
      DataType: datatype === 'BOOL' ? 'BIT' : datatype,
      Hidden: hidden,
      Radix: datatype === 'BOOL' || datatype === 'BIT' ? 'binary' : 'decimal'
    };

    if ((datatype === 'BOOL' || datatype === 'BIT') && target) {
      attributes.Target = target;
      if (bitNumber !== undefined) attributes.BitNumber = bitNumber;
    }

    const elements: XmlElement[] = [];

    if (description) {
      elements.push({
        type: 'element',
        name: 'Description',
        elements: [{
          type: 'text',
          text: description
        }]
      });
    }

    const memberElement: XmlElement = {
      type: 'element',
      name: 'Member',
      attributes,
      elements
    };

    super(memberElement);
  }

  static isMember(obj: unknown): obj is Member {
    return obj instanceof Member;
  }
}
