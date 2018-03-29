const fs = require("fs");
const Element = require("../element");
const { resolve } = require("path");
const { hash } = require("../utilities");
const { xml2js } = require("xml-js");

const DOCUMENT_ID = hash("DOCUMENT_ID_STRING");

class Document extends Element {
    constructor(filepath = null) {
        if (filepath && typeof filepath !== "string")
            throw new Error(
                `Document expected to receive filepath of type <String> instead got <${typeof filepath}>`
            );

        // Call parent constructor
        if (filepath) {
            // Start from existing L5X file
            super(xml2js(fs.readFileSync(resolve(filepath)), "utf8"));
        } else {
            // No filepath or tree given, initialize new document
            super({
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
            });
        }

        this.class_id = DOCUMENT_ID;
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
            RedundancyInfo: 2,
            Security: 3,
            SafetyInfo: 4,
            DataTypes: 5,
            Modules: 6,
            AddOnInstructionDefinitions: 7,
            Tags: 8,
            Programs: 9,
            Tasks: 10,
            ParameterConnections: 11,
            CommPorts: 12,
            CST: 13,
            WallClockTime: 14,
            Trends: 15,
            QuickWatcherLists: 16,
            InternetProtocol: 17,
            EthernetPorts: 18,
            EthernetNetwork: 19
        };

        this.findOne("Controller").dom.elements.sort((a, b) => {
            return order[a.name] - order[b.name];
        });
    }

    /**
     * Exports document to provided filepath
     *
     * @param {string} filepath
     * @memberof Document
     */
    export(filepath) {
        fs.writeFileSync(resolve(filepath), this.toString(), "utf8");
    }

    /**
     * Check if passed object is a document
     *
     * @static
     * @param {object} doc - object to test
     * @returns {boolean}
     * @memberof Document
     */
    static isDocument(doc) {
        return doc.class_id && doc.class_id === DOCUMENT_ID;
    }
}

module.exports = Document;
