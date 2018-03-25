const fs = require("fs");
const { resolve } = require("path");
const { xml2js } = require("xml-js");

class Document {
    constructor(filepath = null) {
        // Initialize Base L5X Dom Object
        // --> This Object is in the form that the
        // --> package 'xml-js' will understand
        if (filepath) {
            // Start from existing L5X file
            this._dom = xml2js(fs.readFileSync(resolve(__dirname, filepath)));
        } else {
            // No filepath given, initialize new document
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
     * Finds desired element within the Document
     *
     * @param {string} type - Type of element to look for (e.g. Controller, Datatype, etc)
     * @param {object} [attr=null] - Object of attributes to match in element
     * @param {object} [search_tree=null] - Tree to search on
     * @returns {object|null} found subtree
     * @memberof Document
     */
    find(type, attr = null, search_tree = null) {
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

        // If no tree is passed then search from document root
        let tree = search_tree ? search_tree : this._dom;

        // Nothing left to search, return null
        if (!tree.elements || !Array.isArray(tree.elements) || tree.length === 0) return null;

        // Search elements
        for (let elem of tree.elements) {
            // Check if this is the desired element
            if (elem.name === type) {
                // Check if attributes match
                if (attr) {
                    
                    let test = true;
                    for (let key of Object.keys(attr)) {
                        if (!elem.attributes[key] || elem.attributes[key] !== attr[key])
                            test = false;
                    }

                    if (test) return elem;
                } else {
                    // No attributes need to match
                    return elem;
                }
            }

            // Search branches for desired element
            const subtree = this.find(type, attr, elem);
            if (subtree) return subtree;
        }

        // Nothing found, return null
        return null;
    }

    //export(path) {}
}

module.exports = Document;
