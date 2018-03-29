const Element = require("../element");
const Tag = require("../tag");
const Routine = require("../routine");
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
            throw new Error(`addTag expected tag of type <Tag> instead got <${typeof tag}>`);

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
     * Adds routine to program instance
     *
     * @param {any} routine
     * @memberof Program
     */
    addRoutine(routine) {
        if (!Routine.isRoutine(routine))
            throw new Error(
                `addRoutine expected routine of type <Routine> instead got <${typeof routine}>`
            );

        const routines = this.findOne("Routines");

        /* eslint-disable indent */
        if (routines) routines.append(routine);
        else
            this.append(
                new Element({
                    type: "element",
                    name: "Routines",
                    elements: []
                }).append(routine)
            );
        /* eslint-enable indent */

        this._orderify();
    }

    /**
     * Finds tag in the program instance that matches the name
     *
     * @param {string} name
     * @returns {Tag|null}
     * @memberof Program
     */
    findTag(name) {
        if (typeof name !== "string")
            throw new Error(
                `findTag expected name of type <String> instead got <${typeof name}>`
            );

        const found = this.findOne("Tag", { Name: name });
        if (!found) return null;

        const tag = new Tag(name, found.dom.attributes.DataType);
        tag._dom = found.dom;

        return tag;
    }

    /**
     * Finds routine in the program instance that matches the name
     *
     * @param {string} name
     * @returns {Routine|null}
     * @memberof Program
     */
    findRoutine(name) {
        if (typeof name !== "string")
            throw new Error(
                `findRoutine expected name of type <String> instead got <${typeof name}>`
            );

        const found = this.findOne("Routine", { Name: name });
        if (!found) return null;

        const routine = new Routine(name);
        routine._dom = found.dom;

        return routine;
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
