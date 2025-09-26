import { readFileSync, writeFileSync } from 'fs';
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

  addTag(tag: Tag): this {
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

    let tagsElement = this.findOne('Tags', undefined, ['Programs'], controller);
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
    this._orderify();
    return this;
  }

  addProgram(program: any): this {
    // Using any to avoid circular dependency issues
    const controller = this.findOne('Controller');
    if (!controller) {
      throw new Error('Controller element not found');
    }

    if (!controller.elements) {
      controller.elements = [];
    }

    let programsElement = this.findOne('Programs', undefined, [], controller);
    if (!programsElement) {
      programsElement = {
        type: 'element',
        name: 'Programs',
        elements: []
      };
      controller.elements.push(programsElement);
    }

    if (!programsElement.elements) {
      programsElement.elements = [];
    }

    programsElement.elements.push(program.dom as XmlElement);
    this._orderify();
    return this;
  }

  getTags(): Tag[] {
    // Only get controller-level tags, not program-scoped tags
    const controller = this.findOne('Controller');
    if (!controller) return [];

    const tagsElement = this.findOne('Tags', undefined, ['Programs'], controller);
    if (!tagsElement || !tagsElement.elements) return [];

    return tagsElement.elements
      .filter(elem => elem.name === 'Tag')
      .map(elem => {
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

  findTag(name: string): Tag | null {
    validateString(name, 'findTag name');

    const found = this.findOne('Tag', { Name: name }, ['Programs']);
    if (!found) return null;

    return new Tag({
      name: found.attributes?.Name as string,
      datatype: found.attributes?.DataType as string,
      description: this.findOne('Description', undefined, [], found)?.elements?.[0]?.text
    });
  }

  findProgram(name: string): any | null {
    validateString(name, 'findProgram name');

    const found = this.findOne('Program', { Name: name });
    if (!found) return null;

    return found;
  }

  setTarget(target: Element): void {
    if (!Element.isElement(target)) {
      throw new Error('setTarget expected Element instance');
    }

    const targetElement = target.dom as XmlElement;
    const docElement = this._dom as XmlDocument;

    // Clear existing targets
    const existingProgram = this.findOne('Program', { Use: 'Target' });
    if (existingProgram && existingProgram.attributes) {
      existingProgram.attributes.Use = 'Context';
    }

    const existingRoutine = this.findOne('Routine', { Use: 'Target' });
    if (existingRoutine && existingRoutine.attributes) {
      existingRoutine.attributes.Use = 'Context';
    }

    // Set new target
    if (docElement.elements && docElement.elements[0] && docElement.elements[0].attributes) {
      const targetName = targetElement.attributes?.Name;
      if (targetName) {
        docElement.elements[0].attributes.TargetName = targetName;
      }
      
      if (!targetElement.attributes) {
        targetElement.attributes = {};
      }
      targetElement.attributes.Use = 'Target';

      switch (targetElement.name) {
        case 'Program':
          docElement.elements[0].attributes.TargetType = 'Program';
          break;
        case 'Routine':
          docElement.elements[0].attributes.TargetType = 'Routine';
          break;
        default:
          throw new Error(`setTarget could not set passed element as Target - Unrecognized Element Type <${targetElement.name}>`);
      }
    }
  }

  export(filepath: string): void {
    validateString(filepath, 'export filepath');
    writeFileSync(resolve(filepath), this.toString(), 'utf8');
  }

  private _orderify(): void {
    const order: Record<string, number> = {
      Description: 1,
      RedundancyInfo: 2,
      Security: 3,
      SafetyInfo: 4,
      DataTypes: 5,
      Modules: 6,
      AddOnInstructionDefinitions: 7,
      Tags: 8,
      Programs: 9,
      Tasks: 10,
      ParameterConnections: 11,
      CommPorts: 12,
      CST: 13,
      WallClockTime: 14,
      Trends: 15,
      QuickWatcherLists: 16,
      InternetProtocol: 17,
      EthernetPorts: 18,
      EthernetNetwork: 19
    };

    const controller = this.findOne('Controller');
    if (controller && controller.elements) {
      controller.elements.sort((a, b) => {
        const aOrder = order[a.name || ''] || 999;
        const bOrder = order[b.name || ''] || 999;
        return aOrder - bOrder;
      });
    }
  }

  static isDocument(obj: unknown): obj is Document {
    return obj instanceof Document;
  }
}
