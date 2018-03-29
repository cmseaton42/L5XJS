const Document = require("./index");
const Tag = require("../tag");
const Program = require("../program");
const Routine = require("../routine");
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

        test("addTag: Throws on Invalid Input", () => {
            const fn = tag => () => docFull.addTag(tag);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn("notATag")).toThrow();
        });

        test("addTag: Adds Tag to Document Instance", () => {
            docFull.addTag(new Tag("tag1", "BOOL"));
            docEmpty.addTag(new Tag("tag1", "BOOL"));
            expect(docFull).toMatchSnapshot();
            expect(docEmpty).toMatchSnapshot();

            docFull.addTag(new Tag("tag2", "DINT"));
            docEmpty.addTag(new Tag("tag2", "DINT"));
            expect(docFull).toMatchSnapshot();
            expect(docEmpty).toMatchSnapshot();

            docEmpty.addTag(new Tag("tag3", "SINT"));
            expect(docEmpty).toMatchSnapshot();

            const tag4 = new Tag("tag4", "REAL");
            docEmpty.addTag(tag4);
            expect(docEmpty).toMatchSnapshot();

            tag4.dom.attributes.Name = "not_tag4Anymore";
            expect(docEmpty).toMatchSnapshot();
        });


        test("addProgam: Throws on Invalid Input", () => {
            const fn = prog => () => docFull.addProgram(prog);

            expect(fn(new Program("notATag"))).not.toThrow();
            expect(fn(new Tag("ATag", "DINT"))).toThrow();
            expect(fn("notATag")).toThrow();
        });

        test("addProgram: Adds Program to Document Instance", () => {
            docFull.addProgram(new Program("aProgram"));
            docFull.addProgram(new Program("bProgram"));
            docFull.addProgram(new Program("cProgram"));

            docEmpty.addProgram(new Program("aProgram"));
            docEmpty.addProgram(new Program("bProgram"));
            docEmpty.addProgram(new Program("cProgram"));

            expect(docFull).toMatchSnapshot();
            expect(docEmpty).toMatchSnapshot();

            const prog = new Program("dProgram");
            docEmpty.addProgram(prog);
            expect(docEmpty).toMatchSnapshot();

            prog.addRoutine(new Routine("aRoutine"));
            expect(docEmpty).toMatchSnapshot();
        });

        test("findTag: Throws on Invalid Input", () => {
            const fn = name => () => docEmpty.findTag(name);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn(12)).toThrow();
            expect(fn("aTag")).not.toThrow();
        });

        test("findTag: Finds Target Tag", () => {
            docEmpty.addTag(new Tag("aTag", "DINT"));
            docEmpty.addTag(new Tag("bTag", "SINT"));

            const tag = new Tag("cTag", "BOOL");
            docEmpty.addTag(tag);

            expect(docEmpty.findTag("aTag")).not.toBeNull();
            expect(docEmpty.findTag("aTag")).toMatchSnapshot();
            expect(docEmpty.findTag("bTag")).not.toBeNull();
            expect(docEmpty.findTag("bTag")).toMatchSnapshot();
            expect(docEmpty.findTag("cTag")).not.toBeNull();
            expect(docEmpty.findTag("cTag")).toMatchSnapshot();
            expect(docEmpty.findTag("dTag")).toBeNull();

            docEmpty.findTag("cTag").dom.attributes.Name = "eTag";
            expect(docEmpty).toMatchSnapshot();
            expect(tag).toMatchSnapshot();
        });

        test("findProgram: Throws on Invalid Input", () => {
            const fn = name => () => docEmpty.findProgram(name);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn(12)).toThrow();
            expect(fn("aProgram")).not.toThrow();
        });

        test("findProgram: Finds Target Program", () => {
            docEmpty.addProgram(new Program("aProgram"));
            docEmpty.addProgram(new Program("bProgram"));

            const prog = new Program("cProgram");
            docEmpty.addProgram(prog);

            expect(docEmpty.findProgram("aProgram")).not.toBeNull();
            expect(docEmpty.findProgram("aProgram")).toMatchSnapshot();
            expect(docEmpty.findProgram("bProgram")).not.toBeNull();
            expect(docEmpty.findProgram("bProgram")).toMatchSnapshot();
            expect(docEmpty.findProgram("cProgram")).not.toBeNull();
            expect(docEmpty.findProgram("cProgram")).toMatchSnapshot();
            expect(docEmpty.findProgram("dProgram")).toBeNull();

            docEmpty.findProgram("cProgram").dom.attributes.Name = "eProgram";
            expect(docEmpty).toMatchSnapshot();
            expect(prog).toMatchSnapshot();
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
            docEmpty
                .findOne("Controller")
                .dom.elements.push({ type: "element", name: "Tags", elements: [] });

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
