import { Element } from '../element';
import { Tag } from '../tag';
import { validateString } from '../utilities';
import { XmlElement, ProgramOptions } from '../types';

export class Program extends Element {
  constructor(options: ProgramOptions) {
    const { name, description, safety = false } = options;

    validateString(name, 'Program name');
    if (description !== undefined) validateString(description, 'Program description');

    const attributes = {
      Name: name,
      Type: 'Normal',
      Class: safety ? 'Safety' : 'Standard',
      Use: 'Context'
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

    const programElement: XmlElement = {
      type: 'element',
      name: 'Program',
      attributes,
      elements
    };

    super(programElement);
  }

  addTag(tag: Tag): this {
    if (!Tag.isTag(tag)) {
      throw new Error('addTag expected Tag instance');
    }

    const programElement = this._dom as XmlElement;
    if (!programElement.elements) {
      programElement.elements = [];
    }

    let tagsElement = this.findOne('Tags');
    if (!tagsElement) {
      tagsElement = {
        type: 'element',
        name: 'Tags',
        elements: []
      };
      programElement.elements.push(tagsElement);
    }

    if (!tagsElement.elements) {
      tagsElement.elements = [];
    }

    tagsElement.elements.push(tag.dom as XmlElement);
    this._orderify();
    return this;
  }

  addRoutine(routine: any): this {
    // Using any for now to avoid circular dependency
    const programElement = this._dom as XmlElement;
    if (!programElement.elements) {
      programElement.elements = [];
    }

    let routinesElement = this.findOne('Routines');
    if (!routinesElement) {
      routinesElement = {
        type: 'element',
        name: 'Routines',
        elements: []
      };
      programElement.elements.push(routinesElement);
    }

    if (!routinesElement.elements) {
      routinesElement.elements = [];
    }

    routinesElement.elements.push(routine.dom as XmlElement);
    this._orderify();
    return this;
  }

  findTag(name: string): Tag | null {
    validateString(name, 'findTag name');

    const found = this.findOne('Tag', { Name: name });
    if (!found) return null;

    return new Tag({
      name: found.attributes?.Name as string,
      datatype: found.attributes?.DataType as string,
      description: this.findOne('Description', undefined, [], found)?.elements?.[0]?.text
    });
  }

  findRoutine(name: string): any | null {
    validateString(name, 'findRoutine name');
    
    const found = this.findOne('Routine', { Name: name });
    if (!found) return null;

    return found;
  }

  private _orderify(): void {
    const order: Record<string, number> = {
      Description: 1,
      Tags: 2,
      Routines: 3,
      ChildPrograms: 4
    };

    const programElement = this._dom as XmlElement;
    if (programElement.elements) {
      programElement.elements.sort((a, b) => {
        const aOrder = order[a.name || ''] || 999;
        const bOrder = order[b.name || ''] || 999;
        return aOrder - bOrder;
      });
    }
  }

  static isProgram(obj: unknown): obj is Program {
    return obj instanceof Program;
  }
}
