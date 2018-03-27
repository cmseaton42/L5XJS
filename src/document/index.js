const fs = require("fs");
const { resolve } = require("path");
const { hash } = require("../utilities");
const { xml2js, js2xml } = require("xml-js");

// const ElementTypes = [
//     "Controller",
//     "DataType",
//     "Tag",
//     "Member",
//     "Program",
//     "Routine",
//     "Rung",
//     "RLLContent"
// ];

class Document {
    constructor(filepath = null, document_tree = null) {
        this.class_id = hash("I'm a Document Class");

        // Initialize Base L5X Dom Object
        // --> This Object is in the form that the
        // --> package 'xml-js' will understand
        if (filepath) {
            // Start from existing L5X file
            this._dom = xml2js(fs.readFileSync(resolve(__dirname, filepath)), "utf8");
        } else if (document_tree) {
            // Set document to incoming document tree
            this._dom = document_tree;
        } else {
            // No filepathor tree given, initialize new document
            this._dom = {
                declaration: {
                    attributes: { version: "1.0", encoding: "UTF-8", standalone: "yes" }
                },
                elements: [
                    {
                        type: "element",
                        name: "RSLogix5000Content",
                        attributes: { SchemaRevision: "1.0", ContainsContext: true },
                        elements: [
                            {
                                type: "element",
                                name: "Controller",
                                attributes: { Use: "context" },
                                elements: []
                            }
                        ]
                    }
                ]
            };
        }
    }

    /**
     * Returns a mutable dom reference to be manipulated by user
     *
     * @readonly
     * @memberof Document
     */
    get dom() {
        return this._dom;
    }

    /**
     * Finds the first desired element within the Document
     *
     * @param {string} type - Type of element to look for (e.g. Controller, Datatype, etc)
     * @param {object} [attr=null] - Object of attributes to match in element
     * @param {object} [search_tree=null] - Tree to search on
     * @returns {object|null} found documents
     * @memberof Document
     */
    findOne(type, attr = null, search_tree = null, ignore = []) {
        // Validate Inputs
        if (typeof type !== "string")
            throw new Error(
                `Find expected a type name of type <String> instead got type <${typeof type}>`
            );

        if (attr && typeof attr !== "object")
            throw new Error(
                `Find expected a attr of type <Object> or null instead got <${typeof attr}>`
            );

        if (search_tree && typeof search_tree !== "object")
            throw new Error(
                `Find expected a search tree of type <Object> or null instead got <${typeof search_tree}>`
            );

        if (!Array.isArray(ignore))
            throw new Error(
                `Find expected a ignore of type <Array> instead got <${typeof ignore}>`
            );

        // If no tree is passed then search from document root
        let tree = search_tree ? search_tree : this._dom;

        // Nothing left to search, return null
        if (!tree.elements || !Array.isArray(tree.elements) || tree.length === 0) return null;

        // Search elements
        for (let elem of tree.elements) {
            if (!ignore.includes(elem.name)) {
                // Check if this is the desired element
                if (elem.name === type) {
                    // Check if attributes match
                    if (attr) {
                        let attrMatch = true;
                        for (let key of Object.keys(attr)) {
                            if (!elem.attributes[key] || elem.attributes[key] !== attr[key])
                                attrMatch = false;
                        }

                        // Attributes match so return subtree
                        if (attrMatch) return new Document(null, elem);
                    } else {
                        // No attributes need to match
                        return new Document(null, elem);
                    }
                }
                // Search branches for desired element
                const found = this.findOne(type, attr, elem);

                if (found) return found;
            }
        }

        // Nothing found, return null
        return null;
    }

    /**
     * Finds desired element within the Document
     *
     * @param {string} type - Type of element to look for (e.g. Controller, Datatype, etc)
     * @param {object} [attr=null] - Object of attributes to match in element
     * @param {object} [search_tree=null] - Tree to search on
     * @param {Array} [ignore=null] - Names to Ignore
     * @returns {Array|null} found documents
     * @memberof Document
     */
    find(type, attr = null, search_tree = null, ignore = []) {
        // Validate Inputs
        if (typeof type !== "string")
            throw new Error(
                `Find expected a type name of type <String> or null instead got type <${typeof type}>`
            );

        if (attr && typeof attr !== "object")
            throw new Error(
                `Find expected a attr of type <Object> or null instead got <${typeof attr}>`
            );

        if (search_tree && typeof search_tree !== "object")
            throw new Error(
                `Find expected a search tree of type <Object> or null instead got <${typeof search_tree}>`
            );

        if (!Array.isArray(ignore))
            throw new Error(
                `Find expected a ignore of type <Array> instead got <${typeof ignore}>`
            );

        let returnArray = [];

        // Search function definiton
        const _find = (type, attr, search_tree) => {
            // Nothing left to search, return null
            if (
                !search_tree.elements ||
                !Array.isArray(search_tree.elements) ||
                search_tree.elements.length === 0
            )
                return null;

            // Search elements
            for (let elem of search_tree.elements) {
                // explore tree if not in ignores
                if (!ignore.includes(elem.name)) {
                    // Check if this is the desired element
                    if (elem.name === type) {
                        // Check if attributes match
                        if (attr) {
                            let attrMatch = true;
                            for (let key of Object.keys(attr)) {
                                if (!elem.attributes[key] || elem.attributes[key] !== attr[key])
                                    attrMatch = false;
                            }

                            // Attributes match so return subtree
                            if (attrMatch) {
                                returnArray.push(new Document(null, elem));
                            }
                        } else {
                            // No attributes need to match
                            returnArray.push(new Document(null, elem));
                        }
                    } else {
                        _find(type, attr, elem);
                    }
                }
            }
        };

        // If no tree is passed then search from document root
        let tree = search_tree ? search_tree : this._dom;

        _find(type, attr, tree);

        return returnArray.length > 0 ? returnArray : null;
    }

    /**
     * Appends element to doc._dom.elements
     *
     * @param {Document} doc
     * @returns {Document} - this (for chaining)
     * @memberof Document
     */
    append(doc) {
        if (!Document.isDocument(doc))
            throw new Error(
                `Append expected to receive doc of type <Document> instead got type <${typeof doc}>`
            );

        if (this._dom.elements && Array.isArray(this._dom.elements))
            this._dom.elements.push(doc.dom);
        else this._dom.elements = [doc.dom];

        return this;
    }

    /**
     * Adds a tag to passed document
     *
     * @param {string} tagname
     * @param {object} [options={}]
     * @param {string} [prog=null]
     * @param {string} [description=null]
     * @memberof Document
     */
    addTag(tagname, options = {}, prog = null, description = null) {
        if (typeof tagname !== "string")
            throw new Error(
                `addTag expected tagname of type <String> instead got <${typeof tagname}>`
            );

        if (options && typeof options !== "object")
            throw new Error(
                `addTag expected options of type <Object> instead got <${typeof options}>`
            );

        if (prog && typeof prog !== "string")
            throw new Error(`addTag expected prog of type <String> instead got <${typeof prog}>`);

        if (description && typeof description !== "string")
            throw new Error(
                `addTag expected description of type <String> instead got <${typeof description}>`
            );

        // Merge defaults with passed options object
        const attributes = Object.assign(
            {},
            { TagType: "Base", DataType: "DINT", Class: "Standard", ExternalAccess: "Read/Write" },
            options
        );

        /* eslint-disable indent */
        // Find target to mount new tag too
        const target = prog
            ? this.findOne("Program", {
                  Name: prog
              })
            : this.findOne("Controller");

        if (!target)
            throw new Error(
                `addTag could not find a ${
                    prog ? "Program" : "Controller"
                } target element to mount tag`
            );

        // Build new tag element
        const tag = new Document(null, {
            type: "element",
            name: "Tag",
            attributes: {
                ...attributes,
                Name: tagname
            },
            elements: description
                ? [
                      {
                          type: "element",
                          name: "Description",
                          elements: [
                              {
                                  type: "cdata",
                                  cdata: description
                              }
                          ]
                      }
                  ]
                : []
        });

        // Get tags element from target
        let tags = prog
            ? target.findOne("Tags", {}, null)
            : target.findOne("Tags", {}, null, ["Programs"]);

        if (tags) tags.append(tag);
        else
            target.append(
                new Document(null, {
                    type: "element",
                    name: "Tags"
                }).append(tag)
            );
        /* eslint-enable indent */
    }

    /**
     * Add program element to document
     * - only if document has controller element
     *
     * @param {string} progname
     * @param {string} [description=null]
     * @param {string} [use="Context"]
     * @memberof Document
     */
    addProgram(progname, description = null, use = "Context") {
        if (typeof progname !== "string")
            throw new Error(
                `addProgram expected tagname of type <String> instead got <${typeof tagname}>`
            );

        if (typeof use !== "string")
            throw new Error(`addProgram expected use of type <String> instead got <${typeof use}>`);

        if (use !== "Context" && use !== "Target") {
            throw new Error(
                `addProgram expected use to be 'Context' or 'Target' instead got '${use}'`
            );
        }

        if (description && typeof description !== "string")
            throw new Error(
                `addProgram expected description of type <String> instead got <${typeof description}>`
            );

        /* eslint-disable indent */
        // Find target to mount new tag too
        const target = this.findOne("Controller");

        if (!target)
            throw new Error(
                "addProgram could not find a Controller target element to mount program"
            );

        // Build new tag element
        const program = new Document(null, {
            type: "element",
            name: "Program",
            attributes: {
                Use: use,
                Name: progname
            },
            elements: description
                ? [
                      {
                          type: "element",
                          name: "Description",
                          elements: [
                              {
                                  type: "cdata",
                                  cdata: description
                              }
                          ]
                      }
                  ]
                : []
        });

        // Get tags element from target
        let programs = target.findOne("Programs");

        if (programs) programs.append(program);
        else
            target.append(
                new Document(null, {
                    type: "element",
                    name: "Programs"
                }).append(program)
            );
        /* eslint-enable indent */
    }

    /**
     * Adds routine to target program
     * - only if document has target program element
     *
     * @param {string} routname
     * @param {string} prog
     * @param {string} [description=null]
     * @param {string} [use="Context"]
     * @memberof Document
     */
    addLadderRoutine(routname, prog, description = null, use = "Context") {
        if (typeof routname !== "string")
            throw new Error(
                `addLadderRoutine expected routname of type <String> instead got <${typeof routname}>`
            );

        if (typeof prog !== "string")
            throw new Error(
                `addLadderRoutine expected prog of type <String> instead got <${typeof prog}>`
            );

        if (typeof use !== "string")
            throw new Error(
                `addLadderRoutine expected use of type <String> instead got <${typeof use}>`
            );

        if (use !== "Context" && use !== "Target") {
            throw new Error(
                `addLadderRoutine expected use to be 'Context' or 'Target' instead got '${use}'`
            );
        }

        if (description && typeof description !== "string")
            throw new Error(
                `addLadderRoutine expected description of type <String> instead got <${typeof description}>`
            );

        /* eslint-disable indent */
        // Find target to mount new tag too
        const target = this.findOne("Program", { Name: prog });

        if (!target)
            throw new Error(
                "addLadderRoutine could not find Program target element to mount routine"
            );

        // Build new tag element
        const routine = new Document(null, {
            type: "element",
            name: "Routine",
            attributes: {
                Use: use,
                Name: routname
            },
            elements: description
                ? [
                      {
                          type: "element",
                          name: "Description",
                          elements: [
                              {
                                  type: "cdata",
                                  cdata: description
                              }
                          ]
                      }
                  ]
                : []
        });

        // Get tags element from target
        let routines = target.findOne("Routines");

        if (routines) routines.append(routine);
        else
            target.append(
                new Document(null, {
                    type: "element",
                    name: "Routines"
                }).append(routine)
            );
        /* eslint-enable indent */
    }

    /**
     * Returns a string representation of the current document
     *
     * @returns {string}
     * @memberof Document
     */
    toString() {
        return js2xml(this._dom);
    }

    /**
     * Exports document to provided filepath
     *
     * @param {string} filepath
     * @memberof Document
     */
    export(filepath) {
        fs.writeFileSync(resolve(__dirname, filepath), this.toString());
    }

    /**
     * Check if passed object is a document
     *
     * @static
     * @param {object} doc - object to test
     * @returns {boolean}
     * @memberof Document
     */
    static isDocument(doc) {
        return doc.class_id && doc.class_id === hash("I'm a Document Class");
    }
}

module.exports = Document;
