const Element = require("../element");
const { hash } = require("../utilities");

const TAG_ID = hash("TAG_ID_STRING");

class Tag extends Element {
    constructor(name, datatype, description = null, alias = null, safety = false) {
        if (typeof name !== "string")
            throw new Error(
                `Tag constructor expected name of type <String> instead got <${typeof name}>`
            );

        if (typeof datatype !== "string")
            throw new Error(
                `Tag constructor expected datatype of type <String> instead got <${typeof datatype}>`
            );

        if (description && typeof description !== "string")
            throw new Error(
                `Tag constructor expected description of type <String> instead got <${typeof description}>`
            );

        if (alias && typeof alias !== "string")
            throw new Error(
                `Tag constructor expected alias of type <String> instead got <${typeof alias}>`
            );

        if (safety && typeof safety !== "boolean")
            throw new Error(
                `Tag constructor expected safety of type <Boolean> instead got <${typeof safety}>`
            );

        let attributes = {
            Name: name,
            DataType: datatype,
            TagType: alias ? "Alias" : "Base",
            Class: safety ? "Safety" : "Standard"
        };

        if (alias) attributes.AliasFor = alias;

        let elements = [];

        /* eslint-disable indent */
        if (description)
            elements.push({
                type: "element",
                name: "Description",
                elements: [
                    {
                        type: "cdata",
                        cdata: description
                    }
                ]
            });
        /* eslint-enable indent */

        // Call parent class constructor
        super({
            type: "element",
            name: "Tag",
            attributes,
            elements
        });

        this.class_id = TAG_ID;
    }

    /**
     * Checks if an incoming object is a tag instance
     *
     * @static
     * @param {any} tag
     * @returns {boolean}
     * @memberof Tag
     */
    static isTag(tag) {
        return tag.class_id && tag.class_id === TAG_ID;
    }
}

module.exports = Tag;
