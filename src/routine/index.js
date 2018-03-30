const Element = require("../element");
const Rung = require("../rung");
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
     * Adds a rung to the ladder content
     *
     * @param {Rung} rung
     * @memberof Routine
     */
    addRung(rung) {
        if (!Rung.isRung(rung))
            throw new Error(`addRung expected rung of type <Rung> instead got <${typeof rung}>`);

        const rllContent = this.findOne("RLLContent");
        const rungNum = rllContent.dom.elements.length;

        rung.dom.attributes.Number = rungNum;

        rllContent.append(rung);
        return this;
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
