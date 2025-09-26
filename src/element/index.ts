import { js2xml } from 'xml-js';
import { validateString, validateObject } from '../utilities';
import { XmlElement, XmlDocument } from '../types';

export class Element {
  protected _dom: XmlDocument | XmlElement;

  constructor(documentTree: XmlDocument | XmlElement) {
    validateObject(documentTree, 'Element constructor documentTree');
    this._dom = documentTree;
  }

  get dom(): XmlDocument | XmlElement {
    return this._dom;
  }

  findOne(
    type: string,
    attributes?: Record<string, string | number | boolean>,
    ignore: string[] = [],
    searchTree?: XmlElement
  ): XmlElement | null {
    validateString(type, 'findOne type');

    if (attributes) validateObject(attributes, 'findOne attributes');
    if (!Array.isArray(ignore)) {
      throw new Error('findOne ignore expected type <Array>');
    }

    const tree = searchTree || this._dom;

    if (!tree.elements || !Array.isArray(tree.elements) || tree.elements.length === 0) {
      return null;
    }

    for (const elem of tree.elements) {
      if (!elem.name || ignore.includes(elem.name)) continue;

      if (elem.name === type) {
        if (attributes) {
          const attrMatch = Object.entries(attributes).every(
            ([key, value]) => elem.attributes?.[key] === value
          );
          if (attrMatch) return elem;
        } else {
          return elem;
        }
      }

      const found = this.findOne(type, attributes, ignore, elem);
      if (found) return found;
    }

    return null;
  }

  findAll(
    type: string,
    attributes?: Record<string, string | number | boolean>,
    ignore: string[] = [],
    searchTree?: XmlElement
  ): XmlElement[] {
    const results: XmlElement[] = [];
    const tree = searchTree || this._dom;

    if (!tree.elements || !Array.isArray(tree.elements)) return results;

    for (const elem of tree.elements) {
      if (!elem.name || ignore.includes(elem.name)) continue;

      if (elem.name === type) {
        if (attributes) {
          const attrMatch = Object.entries(attributes).every(
            ([key, value]) => elem.attributes?.[key] === value
          );
          if (attrMatch) results.push(elem);
        } else {
          results.push(elem);
        }
      }

      results.push(...this.findAll(type, attributes, ignore, elem));
    }

    return results;
  }

  toString(): string {
    return js2xml(this._dom, { compact: false, spaces: 4 });
  }

  static isElement(obj: unknown): obj is Element {
    return obj instanceof Element;
  }
}
