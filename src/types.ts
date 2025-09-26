export interface XmlElement {
  type?: string;
  name?: string;
  attributes?: Record<string, string | number | boolean>;
  elements?: XmlElement[];
  text?: string;
}

export interface XmlDocument {
  declaration?: {
    attributes: {
      version: string;
      encoding: string;
      standalone?: string;
    };
  };
  elements: XmlElement[];
}

export interface TagOptions {
  name: string;
  datatype: string;
  description?: string;
  alias?: string;
  safety?: boolean;
  dimension?: number;
}

export interface ProgramOptions {
  name: string;
  description?: string;
  safety?: boolean;
}

export interface RoutineOptions {
  name: string;
  type?: string;
  description?: string;
}

export interface FindOptions {
  type: string;
  attributes?: Record<string, string | number | boolean>;
  ignore?: string[];
  searchTree?: XmlElement;
}
