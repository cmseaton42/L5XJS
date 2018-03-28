const Element = require("../element");
const Tag = require("../tag");
const { hash } = require("../utilities");

const PROGRAM_ID = hash("PROGRAM_ID_STRING");

class Program extends Element {
    constructor(name, description = null, safety = false) {
        if (typeof name !== "string")
            throw new Error(
                `Program constructor expected name of type <String> instead got <${typeof name}>`
            );

        if (description && typeof description !== "string")
            throw new Error(
                `Program constructor expected description of type <String> instead got <${typeof description}>`
            );

        if (safety && typeof safety !== "boolean")
            throw new Error(
                `Program constructor expected safety of type <Boolean> instead got <${typeof safety}>`
            );

        let attributes = {
            Name: name,
            Type: "Normal",
            Class: safety ? "Safety" : "Standard"
        };

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
            name: "Program",
            attributes,
            elements
        });

        this.class_id = PROGRAM_ID;
    }

    /**
     * Adds tag to program instance
     *
     * @param {Tag} tag
     * @memberof Program
     */
    addTag(tag) {
        if (!Tag.isTag(tag))
            throw new Error(`addTag expected tag of type <Tag> instead got type <${typeof tag}>`);

        const tags = this.findOne("Tags");

        /* eslint-disable indent */
        if (tags) tags.append(tag);
        else
            this.append(
                new Element({
                    type: "element",
                    name: "Tags",
                    elements: []
                }).append(tag)
            );
        /* eslint-enable indent */

        this._orderify();
    }

    /**
     * Puts the programs children in the correct order
     *
     * @private
     * @memberof Program
     */
    _orderify() {
        const order = {
            Description: 1,
            Tags: 2,
            Routines: 3
        };

        this.dom.elements.sort((a, b) => {
            return order[a.name] - order[b.name];
        });
    }

    /**
     * Checks if an incoming object is a program instance
     *
     * @static
     * @param {any} program
     * @returns {boolean}
     * @memberof Tag
     */
    static isProgram(program) {
        return program.class_id && program.class_id === PROGRAM_ID;
    }
}

module.exports = Program;
