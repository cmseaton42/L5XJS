const Element = require("../element");
const { hash } = require("../utilities");

const ROUTINE_ID = hash("ROUTINE_ID_STRING");

class Routine extends Element {
    constructor(name, description = null) {
        if (typeof name !== "string")
            throw new Error(
                `Routine constructor expected name of type <String> instead got <${typeof name}>`
            );

        if (description && typeof description !== "string")
            throw new Error(
                `Routine constructor expected description of type <String> instead got <${typeof description}>`
            );

        let attributes = {
            Name: name,
            Type: "RLL" // Specify Ladder Logic
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

        elements.push({
            type: "element",
            name: "RLLContent", // Routine content
            elements: []
        });
        /* eslint-enable indent */

        // Call parent class constructor
        super({
            type: "element",
            name: "Routine",
            attributes,
            elements
        });

        this.class_id = ROUTINE_ID;
    }

    /**
     * Checks if an incoming object is a Routine instance
     *
     * @static
     * @param {any} routine
     * @returns {boolean}
     * @memberof Tag
     */
    static isRoutine(routine) {
        return routine.class_id && routine.class_id === ROUTINE_ID;
    }
}

module.exports = Routine;
