const Document = require("./index");
const fs = require("fs");
const path = require("path");

describe("Document Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = arg => () => new Document(arg);

            expect(fn("./__test-data__/fakeFile.L5X")).toThrow();
            expect(fn(57)).toThrow();
            expect(fn("./__test-data__/datatype.L5X")).not.toThrow();
            expect(fn()).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            const doc1 = new Document();
            const doc2 = new Document("./__test-data__/datatype.L5X");

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

    describe("Instance Methods", () => {
        let docFull;
        let docEmpty;

        beforeEach(() => {
            docFull = new Document("./__test-data__/datatype.L5X");
            docEmpty = new Document();
        });

        test("get dom: Gets Mutable Dom Reference", () => {
            expect(docFull.dom).toMatchSnapshot();
        });

        test("findOne: Finds First Document Element", () => {
            expect(docFull.findOne("nothing")).toBeNull();
            expect(docEmpty.findOne("nothing")).toBeNull();

            expect(docFull.findOne("Controller")).not.toBeNull();

            expect(docFull.findOne("Controller")).toMatchSnapshot();

            expect(docEmpty.findOne("Controller")).not.toBeNull();
            expect(docEmpty.findOne("Controller")).toMatchSnapshot();

            expect(docFull.findOne("Member", { Name: "Push" })).not.toBeNull();
            expect(docEmpty.findOne("Member", { Name: "Push" })).toBeNull();

            expect(docFull.findOne("Member", { Name: "Push" })).toMatchSnapshot();
            expect(docFull.findOne("Member")).toMatchSnapshot();

            expect(
                docFull.findOne("Controller").findOne("Member", { Name: "Push" })
            ).toMatchSnapshot();
            expect(docFull.findOne("Controller").findOne("Member", { name: "Push" })).toBeNull();
        });

        test("findOne: Rejects Invalid Inputs", () => {
            const fn = (type, attr, tree) => () => docFull.findOne(type, attr, tree);

            expect(fn(12, null, null)).toThrow();
            expect(fn("Controller", null, null)).not.toThrow();
            expect(fn("Controller", 12, null)).toThrow();
            expect(fn("Controller", { Name: "another" }, null)).not.toThrow();
            expect(fn("Controller", { Name: "another" }, 12)).toThrow();
            expect(fn("Controller", { Name: "another" }, {})).not.toThrow();
        });

        test("find: Finds Document Elements and Returns New Document", () => {
            expect(docFull.find("nothing")).toBeNull();
            expect(docEmpty.find("nothing")).toBeNull();

            expect(docFull.find("Controller")).not.toBeNull();
            expect(docFull.find("Controller")).toMatchSnapshot();

            expect(docEmpty.find("Controller")).not.toBeNull();
            expect(docEmpty.find("Controller")).toMatchSnapshot();

            expect(docFull.find("Member", { Name: "Push" })).not.toBeNull();
            expect(docEmpty.find("Member", { Name: "Push" })).toBeNull();

            expect(docFull.find("Member", { Name: "Push" })).toMatchSnapshot();
            expect(docFull.find("Member")).toMatchSnapshot();

            expect(
                docFull.find("Controller")[0].find("Member", { Name: "Push" })
            ).toMatchSnapshot();
            expect(docFull.find("Controller")[0].find("Member", { name: "Push" })).toBeNull();
        });

        test("find: Rejects Invalid Inputs", () => {
            const fn = (type, attr, tree) => () => docFull.find(type, attr, tree);

            expect(fn(12, null, null)).toThrow();
            expect(fn("Controller", null, null)).not.toThrow();
            expect(fn("Controller", 12, null)).toThrow();
            expect(fn("Controller", { Name: "another" }, null)).not.toThrow();
            expect(fn("Controller", { Name: "another" }, 12)).toThrow();
            expect(fn("Controller", { Name: "another" }, {})).not.toThrow();
        });

        test("append: Throws on Invalid Inputs", () => {
            const fn = arg => () => docEmpty.append(arg);

            expect(fn({ key: "value" })).toThrow();
            expect(fn(docFull)).not.toThrow();
        });

        test("append: Appends New Dom Element", () => {
            const tags = new Document(null, {
                type: "element",
                name: "Tags"
            });

            const newTags = docEmpty.findOne("Controller").append(tags);
            expect(docEmpty).toMatchSnapshot();

            tags.append(
                new Document(null, {
                    type: "element",
                    name: "Tag",
                    attributes: {
                        Name: "SomeTag",
                        TagType: "Base"
                    }
                })
            );
            expect(docEmpty).toMatchSnapshot();
        });

        test("addTag: Throws on Invalid Inputs", () => {
            const fn = (tag, opt = {}, prog = null, desc = null) => () =>
                docEmpty.addTag(tag, opt, prog, desc);

            expect(fn(12)).toThrow();
            expect(fn("hello", 12)).toThrow();
            expect(fn("hello", { a: 6 }, 12)).toThrow();
            expect(fn("hello", { a: 6 }, null, 12)).toThrow();
            expect(fn("hello", { a: 6 }, "hello", 12)).toThrow();

            docEmpty.append(
                new Document(null, {
                    type: "element",
                    name: "Programs",
                    elements: [
                        {
                            type: "element",
                            name: "Program",
                            attributes: {
                                Name: "hello"
                            },
                            elements: []
                        }
                    ]
                })
            );

            expect(fn("hello", { a: 6 }, "hello", "it is a tag")).not.toThrow();
            expect(fn("hello", { a: 6 }, null, "it is a tag")).not.toThrow();
        });

        test("addTag: Performs Desired Function", () => {
            const controller = docEmpty.findOne("Controller").append(
                new Document(null, {
                    type: "element",
                    name: "Programs",
                    elements: [
                        {
                            type: "element",
                            name: "Program",
                            attributes: {
                                Name: "hello"
                            },
                            elements: []
                        }
                    ]
                })
            );

            docEmpty.addTag("tag1", {}, null, "A cool tag 1");
            expect(docEmpty).toMatchSnapshot();

            docEmpty.addTag(
                "tag2",
                { AliasFor: "tag1", TagType: "Alias" },
                "hello",
                "A cool tag 2"
            );
            expect(docEmpty).toMatchSnapshot();
        });

        test("export: Exported Data is Correct", () => {
            docFull.export("./__test-data__/generated_datatype.L5X");

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
    });
});
