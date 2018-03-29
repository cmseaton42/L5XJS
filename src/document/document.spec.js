const Document = require("./index");
const fs = require("fs");
const path = require("path");

describe("Document Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = arg => () => new Document(arg);

            expect(fn("./__test-data__/datatype.L5X")).toThrow();
            expect(fn(57)).toThrow();
            expect(fn(path.resolve(__dirname, "./__test-data__/datatype.L5X"))).not.toThrow();
            expect(fn()).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            const doc1 = new Document();
            const doc2 = new Document(path.resolve(__dirname, "./__test-data__/datatype.L5X"));

            expect(doc1._dom).toMatchSnapshot();
            expect(doc2._dom).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isDocument: Returns Appropriate Judgement", () => {
            const doc = new Document();
            const fake = {};

            expect(Document.isDocument(doc)).toBeTruthy();
            expect(Document.isDocument(fake)).toBeFalsy();
        });
    });

    describe("Methods", () => {
        let docFull;
        let docEmpty;

        beforeEach(() => {
            docFull = new Document(path.resolve(__dirname, "./__test-data__/datatype.L5X"));
            docEmpty = new Document();
        });

        test("export: Exported Data is Correct", () => {
            docFull.export(path.resolve(__dirname, "./__test-data__/generated_datatype.L5X"));

            let original = fs.readFileSync(
                path.resolve(__dirname, "./__test-data__/datatype.L5X"),
                "utf8"
            );

            let generated = fs.readFileSync(
                path.resolve(__dirname, "./__test-data__/generated_datatype.L5X"),
                "utf8"
            );

            original = original.replace(/\s/g, "");
            generated = generated.replace(/\s/g, "");

            expect(original === generated).toBeTruthy();

            fs.unlinkSync(path.resolve(__dirname, "./__test-data__/generated_datatype.L5X"));
        });

        test("_orderify: Results in the Correct Order", () => {
            docEmpty.findOne("Controller").dom.elements.push({ type: "element", name: "Tags", elements: [] });

            docEmpty.findOne("Controller").dom.elements.push({
                type: "element",
                name: "Trends",
                elements: []
            });

            docEmpty.findOne("Controller").dom.elements.push({
                type: "element",
                name: "DataTypes",
                elements: []
            });

            docEmpty.findOne("Controller").dom.elements.push({
                type: "element",
                name: "Description",
                elements: []
            });

            docEmpty._orderify();
            expect(docEmpty).toMatchSnapshot();
        });
    });
});
