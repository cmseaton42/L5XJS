const { hash } = require("../utilities");
const { js2xml } = require("xml-js");

const ELEMENT_ID = hash("ELEMENT_ID_STRING");

class Element {
    constructor(document_tree) {
        this.elem_id = ELEMENT_ID;

        if (typeof document_tree !== "object")
            throw new Error(
                `Element must be initialized with a document_tree of type <Object> instead got ${typeof document_tree}`
            );

        // Initialize Base L5X Dom Object
        // --> This Object is in the form that the
        // --> package 'xml-js' will understand
        // No filepathor tree given, initialize new document
        this._dom = document_tree;
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
     * @returns {object|null} found documents
     * @param {object} [search_tree=null] - Tree to search on
     * @memberof Document
     */
    findOne(type, attr = null, ignore = [], search_tree = null) {
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
                        if (attrMatch) return new Element(elem);
                    } else {
                        // No attributes need to match
                        return new Element(elem);
                    }
                }
                // Search branches for desired element
                const found = this.findOne(type, attr, ignore, elem);

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
     * @param {Array} [ignore=null] - Names to Ignore
     * @param {object} [search_tree=null] - Tree to search on
     * @returns {Array|null} found documents
     * @memberof Document
     */
    find(type, attr = null, ignore = [], search_tree = null) {
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
                                returnArray.push(new Element(elem));
                            }
                        } else {
                            // No attributes need to match
                            returnArray.push(new Element(elem));
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
        if (!Element.isElement(doc))
            throw new Error(
                `Append expected to receive doc of type <Element> instead got type <${typeof doc}>`
            );

        if (this._dom.elements && Array.isArray(this._dom.elements))
            this._dom.elements.push(doc.dom);
        else this._dom.elements = [doc.dom];

        return this;
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
     * Check if passed object is a document
     *
     * @static
     * @param {object} doc - object to test
     * @returns {boolean}
     * @memberof Document
     */
    static isElement(doc) {
        return doc.elem_id && doc.elem_id === ELEMENT_ID;
    }
}

module.exports = Element;
