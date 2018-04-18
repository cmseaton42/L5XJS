const Element = require("../element");
const { hash } = require("../utilities");

const MEMBER_ID = hash("MEMBER_ID_STRING");

class Member extends Element {
    constructor(
        name,
        datatype,
        description = null,
        hidden = false,
        target = null,
        bit_number = null
    ) {
        if (typeof name !== "string")
            throw new Error(
                `Member constructor expected name of type <String> instead got <${typeof name}>`
            );

        if (typeof datatype !== "string")
            throw new Error(
                `Member constructor expected datatype of type <String> instead got <${typeof datatype}>`
            );

        if (description && typeof description !== "string")
            throw new Error(
                `Member constructor expected description of type <String> instead got <${typeof description}>`
            );

        if (hidden && typeof hidden !== "boolean")
            throw new Error(
                `Member constructor expected hidden of type <Boolean> instead got <${typeof hidden}>`
            );

        if (target && typeof target !== "string")
            throw new Error(
                `Member constructor expected target of type <String> instead got <${typeof target}>`
            );

        if (bit_number && !target)
            throw new Error("bit_number can only be defined with valid target name");

        if (bit_number && typeof bit_number !== "number")
            throw new Error(
                `Member constructor expected bit_number of type <Number> instead got <${typeof bit_number}>`
            );

        let attributes = {
            Name: name,
            DataType: datatype === "BOOL" ? "BIT" : datatype,
            Hidden: hidden,
            Radix: datatype === "BOOL" || datatype === "BIT" ? "binary" : "decimal"
        };

        if ((datatype === "BOOL" || datatype === "BIT") && target) {
            attributes.Target = target;
            attributes.BitNumber = bit_number;
        }

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
            name: "Member",
            attributes,
            elements
        });

        this.class_id = MEMBER_ID;
    }

    /**
     * Checks if an incoming object is a member instance
     *
     * @static
     * @param {Member} member
     * @returns {boolean}
     * @memberof Tag
     */
    static isMember(member) {
        return member.class_id && member.class_id === MEMBER_ID;
    }
}

module.exports = Member;
