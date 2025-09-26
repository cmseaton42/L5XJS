import { Element } from '../element';
import { validateString } from '../utilities';
import { XmlElement, TagOptions } from '../types';

export class Tag extends Element {
  constructor(options: TagOptions) {
    const { name, datatype, description, alias, safety = false, dimension } = options;

    validateString(name, 'Tag name');
    validateString(datatype, 'Tag datatype');
    
    if (description !== undefined) validateString(description, 'Tag description');
    if (alias !== undefined) validateString(alias, 'Tag alias');

    const attributes: Record<string, string | number | boolean> = {
      Name: name,
      DataType: datatype,
    };

    if (alias) attributes.AliasFor = alias;
    if (safety) attributes.Safety = safety;
    if (dimension !== undefined) attributes.Dimensions = dimension;

    const tagElement: XmlElement = {
      type: 'element',
      name: 'Tag',
      attributes,
      elements: description ? [{
        type: 'element',
        name: 'Description',
        elements: [{ type: 'text', text: description }]
      }] : []
    };

    super(tagElement);
  }

  get name(): string {
    const elem = this._dom as XmlElement;
    return elem.attributes?.Name as string;
  }

  get datatype(): string {
    const elem = this._dom as XmlElement;
    return elem.attributes?.DataType as string;
  }

  get description(): string | undefined {
    const descElem = this.findOne('Description');
    return descElem?.elements?.[0]?.text;
  }

  static isTag(obj: unknown): obj is Tag {
    return obj instanceof Tag;
  }
}
