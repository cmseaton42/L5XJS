import { Element } from '../element';
import { validateString } from '../utilities';
import { XmlElement, RoutineOptions } from '../types';

export class Routine extends Element {
  constructor(options: RoutineOptions) {
    const { name, description, type = 'RLL' } = options;

    validateString(name, 'Routine name');
    if (description !== undefined) validateString(description, 'Routine description');

    const attributes = {
      Name: name,
      Use: 'Context',
      Type: type // RLL = Ladder Logic
    };

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

    elements.push({
      type: 'element',
      name: 'RLLContent',
      elements: []
    });

    const routineElement: XmlElement = {
      type: 'element',
      name: 'Routine',
      attributes,
      elements
    };

    super(routineElement);
  }

  addRung(rung: any): this {
    // TODO: Add proper Rung type check when Rung class is implemented
    const rllContent = this.findOne('RLLContent');
    if (!rllContent) {
      throw new Error('RLLContent not found in routine');
    }

    if (!rllContent.elements) {
      rllContent.elements = [];
    }

    const rungNum = rllContent.elements.length;
    const rungElement = rung.dom as XmlElement;
    
    if (!rungElement.attributes) {
      rungElement.attributes = {};
    }
    rungElement.attributes.Number = rungNum;

    rllContent.elements.push(rungElement);
    return this;
  }

  static isRoutine(obj: unknown): obj is Routine {
    return obj instanceof Routine;
  }
}
