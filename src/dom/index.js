const fs = require("fs");
const { js2xml, xml2js } = require("xml-js");

class Document {
    constructor(filepath) {
        // Initialize Base L5X Dom Object
        // --> This Object is in the form that the
        // --> package 'xml-js' will understand
        if (!filepath) {
            // Start from existing L5X file
            this._dom = xml2js(fs.readFileSync(filepath));
        } else {
            // No filepath given, initialize new document
            this._dom = {
                declaration: {
                    attributes: { version: "1.0", encoding: "UTF-8", standalone: "yes" },
                    elements: [
                        {
                            type: "element",
                            name: "RSLogix5000Content",
                            attributes: { SchemaRevision: "1.0", ContainsContext: true },
                            elements: {
                                type: "element",
                                name: "Controller",
                                attributes: { use: "context" },
                                elements: []
                            }
                        }
                    ]
                }
            };
        }
    }

    /**
     * Finds desired element within the Document
     *
     * @param {string} element - Name of element to look for
     * @param {object} [search_tree=null] - Tree to search on
     * @returns {object|null} found subtree
     * @memberof Document
     */
    find(element, search_tree = null) {
        // If no tree is passed then search from document root
        let tree = search_tree ? search_tree : this._dom;

        // Nothing left to search, return null
        if (!tree.elements || !Array.isArray(tree.elements) || tree.length === 0) return null;

        // Search elements
        for (let elem of this._dom.elements) {
            // Check if this is the desired element
            if (elem.name === element) return elem;

            // Search leeflet for desired element
            const subtree = this.find(element, elem);
            if (subtree) return subtree;
        }

        // nothing found, return null
        return null;
    }
}
