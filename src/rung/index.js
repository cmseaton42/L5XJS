const Element = require("../element");
const { hash } = require("../utilities");

const RUNG_ID = hash("RUNG_ID_STRING");

class Rung extends Element {
    constructor(logic, num, comment = null) {
        if (typeof logic !== "string")
            throw new Error(
                `Rung constructor expected logic of type <String> instead got <${typeof logic}>`
            );

        if (typeof num !== "number")
            throw new Error(
                `Rung constructor expected num of type <Number> instead got <${typeof num}>`
            );

        if (comment && typeof comment !== "string")
            throw new Error(
                `Rung constructor expected comment of type <String> instead got <${typeof comment}>`
            );

        let attributes = {
            Number: num,
            Type: "N"
        };

        let elements = [];

        /* eslint-disable indent */
        if (comment)
            elements.push({
                type: "element",
                name: "Comment",
                elements: [
                    {
                        type: "cdata",
                        cdata: comment
                    }
                ]
            });

        elements.push({
            type: "element",
            name: "Text", // rung content
            elements: [
                {
                    type: "cdata",
                    cdata: logic
                }
            ]
        });
        /* eslint-enable indent */

        // Call parent class constructor
        super({
            type: "element",
            name: "Rung",
            attributes,
            elements
        });

        this.class_id = RUNG_ID;
    }

    /**
     * Checks if an incoming object is a rung instance
     *
     * @static
     * @param {any} rung
     * @returns {boolean}
     * @memberof Tag
     */
    static isRung(rung) {
        return rung.class_id && rung.class_id === RUNG_ID;
    }
}

module.exports = Rung;
