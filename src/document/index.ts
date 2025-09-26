import { readFileSync } from 'fs';
import { resolve } from 'path';
import { xml2js } from 'xml-js';
import { Element } from '../element';
import { Tag } from '../tag';
import { validateString } from '../utilities';
import { XmlDocument, XmlElement } from '../types';

export class Document extends Element {
  constructor(filepath?: string) {
    if (filepath !== undefined) {
      validateString(filepath, 'Document filepath');
    }

    let documentTree: XmlDocument;

    if (filepath) {
      const xmlContent = readFileSync(resolve(filepath), 'utf8');
      documentTree = xml2js(xmlContent, { compact: false }) as XmlDocument;
    } else {
      documentTree = {
        declaration: {
          attributes: { version: '1.0', encoding: 'UTF-8', standalone: 'yes' }
        },
        elements: [{
          type: 'element',
          name: 'RSLogix5000Content',
          attributes: { SchemaRevision: '1.0', ContainsContext: true },
          elements: [{
            type: 'element',
            name: 'Controller',
            attributes: { Use: 'Context' },
            elements: []
          }]
        }]
      };
    }

    super(documentTree);
  }

  addTag(tag: Tag): void {
    if (!Tag.isTag(tag)) {
      throw new Error('addTag expected Tag instance');
    }

    const controller = this.findOne('Controller');
    if (!controller) {
      throw new Error('Controller element not found');
    }

    if (!controller.elements) {
      controller.elements = [];
    }

    let tagsElement = this.findOne('Tags', undefined, [], controller);
    if (!tagsElement) {
      tagsElement = {
        type: 'element',
        name: 'Tags',
        elements: []
      };
      controller.elements.push(tagsElement);
    }

    if (!tagsElement.elements) {
      tagsElement.elements = [];
    }

    tagsElement.elements.push(tag.dom as XmlElement);
  }

  getTags(): Tag[] {
    const tagElements = this.findAll('Tag');
    return tagElements.map(elem => {
      const name = elem.attributes?.Name as string;
      const datatype = elem.attributes?.DataType as string;
      const descElem = this.findOne('Description', undefined, [], elem);
      const description = descElem?.elements?.[0]?.text;

      return new Tag({
        name,
        datatype,
        description,
        alias: elem.attributes?.AliasFor as string,
        safety: elem.attributes?.Safety as boolean,
        dimension: elem.attributes?.Dimensions as number
      });
    });
  }

  static isDocument(obj: unknown): obj is Document {
    return obj instanceof Document;
  }
}
