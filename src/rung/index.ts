import { Element } from '../element';
import { validateString } from '../utilities';
import { XmlElement } from '../types';

export interface RungOptions {
  logic: string;
  number?: number;
  comment?: string;
}

export class Rung extends Element {
  constructor(options: RungOptions) {
    const { logic, number = 0, comment } = options;

    validateString(logic, 'Rung logic');
    if (comment !== undefined) validateString(comment, 'Rung comment');

    const attributes = {
      Number: number,
      Type: 'N'
    };

    const elements: XmlElement[] = [];

    if (comment) {
      elements.push({
        type: 'element',
        name: 'Comment',
        elements: [{
          type: 'text',
          text: comment
        }]
      });
    }

    elements.push({
      type: 'element',
      name: 'Text',
      elements: [{
        type: 'text',
        text: logic
      }]
    });

    const rungElement: XmlElement = {
      type: 'element',
      name: 'Rung',
      attributes,
      elements
    };

    super(rungElement);
  }

  static isRung(obj: unknown): obj is Rung {
    return obj instanceof Rung;
  }
}
