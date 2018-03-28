const Element = require("./index");

describe("Element Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = arg => () => new Element(arg);

            expect(fn("./__test-data__/datatype.L5X")).toThrow();
            expect(fn(57)).toThrow();
            expect(
                fn({
                    type: "element",
                    name: "Element",
                    elements: []
                })
            ).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            const doc = new Element({
                attr: "value"
            });

            expect(doc).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isDocument: Returns Appropriate Judgement", () => {
            const doc = new Element({
                type: "element",
                name: "elem",
                elements: []
            });

            const fake = {};

            expect(doc).toBeTruthy();
            expect(Element.isElement(fake)).toBeFalsy();
        });
    });

    describe("Instance Methods", () => {
        let doc;

        beforeEach(() => {
            doc = new Element({
                type: "element",
                name: "root",
                elements: [
                    {
                        type: "element",
                        name: "Controller",
                        elements: [
                            {
                                type: "element",
                                name: "Tags",
                                elements: [
                                    {
                                        type: "element",
                                        name: "Tag",
                                        attributes: {
                                            Name: "TagName"
                                        },
                                        elements: []
                                    }
                                ]
                            },
                            {
                                type: "element",
                                name: "Programs",
                                elements: [
                                    {
                                        type: "element",
                                        name: "Program",
                                        elements: [
                                            {
                                                type: "element",
                                                name: "Tags",
                                                elements: [
                                                    {
                                                        type: "element",
                                                        name: "Tag",
                                                        attributes: {
                                                            Name: "AnotherTagName"
                                                        },
                                                        elements: []
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
        });

        test("get dom: Gets Dom Reference", () => {
            expect(doc.dom).toMatchSnapshot();
        });

        test("findOne: Finds First Document Element", () => {
            expect(doc.findOne("nothing")).toBeNull();
            expect(doc.findOne("Controller")).not.toBeNull();
            expect(doc.findOne("Controller")).toMatchSnapshot();
            expect(doc.findOne("Member", { Name: "Push" })).toBeNull();
            expect(doc.findOne("Tag", { Name: "AnotherTagName" })).toMatchSnapshot();
            expect(doc.findOne("Tag", { Name: "AnotherTagName" }, ["Tags"])).toBeNull();
            expect(doc.findOne("Tag")).toMatchSnapshot();
            expect(doc.findOne("Controller").findOne("Tag")).toMatchSnapshot();
            expect(doc.findOne("Controller").findOne("Member", { name: "Push" })).toBeNull();
        });

        test("findOne: Rejects Invalid Inputs", () => {
            const fn = (type, attr, ignore = [], tree = null) => () =>
                doc.findOne(type, attr, ignore, tree);

            expect(fn(12, null, [], null)).toThrow();
            expect(fn("Controller", null, [], null)).not.toThrow();
            expect(fn("Controller", 12, null)).toThrow();
            expect(fn("Tag", { Name: "TagName" }, [], null)).not.toThrow();
            expect(fn("Tag", { Name: "TagName" }, [], "string")).toThrow();
            expect(fn("Tag", { Name: "TagName" }, 12)).toThrow();
            expect(fn("Tag", { Name: "TagName" }, [], {})).not.toThrow();
            expect(fn("Tag", { Name: "TagName" }, "throw")).toThrow();
        });

        test("find: Finds Document Elements and Returns New Document", () => {
            expect(doc.find("nothing")).toBeNull();

            expect(doc.find("Controller")).not.toBeNull();
            expect(doc.find("Controller")).toMatchSnapshot();

            expect(doc.find("Tag", { Name: "TagName" })).not.toBeNull();
            expect(doc.find("Member")).toBeNull();

            expect(doc.find("Tag", { Name: "TagName" })).toMatchSnapshot();
            expect(doc.find("Tag")).toMatchSnapshot();

            expect(doc.find("Tags")[0].find("Tag")).toMatchSnapshot();
            expect(doc.find("Tags")[1].find("Tag")).toMatchSnapshot();

            expect(doc.find("Tag", {}, ["Tags"])).toBeNull();
        });

        test("find: Rejects Invalid Inputs", () => {
            const fn = (type, attr, ignore = [], tree) => () => doc.find(type, attr, ignore, tree);

            expect(fn(12, null, null)).toThrow();
            expect(fn("Controller", null)).not.toThrow();
            expect(fn("Controller", 12, null)).toThrow();
            expect(fn("Tag", { Name: "TagName" })).not.toThrow();
            expect(fn("Tag", { Name: "TagName" }, 12)).toThrow();
            expect(fn("Tag", { Name: "TagName" }, [], {})).not.toThrow();
            expect(fn("Tag", { Name: "TagName" }, {}, "Program")).toThrow();
            expect(fn("Member", { Name: "another" }, ["DataTypes"], {})).not.toThrow();
        });

        test("append: Throws on Invalid Inputs", () => {
            const fn = arg => () => doc.append(arg);

            expect(fn({ key: "value" })).toThrow();
            expect(fn(doc)).not.toThrow();
        });

        test("append: Appends New Element", () => {
            const tags = new Element({
                type: "element",
                name: "Tags"
            });

            doc.findOne("Controller").append(tags);
            expect(doc).toMatchSnapshot();

            tags.append(
                new Element({
                    type: "element",
                    name: "Tag",
                    attributes: {
                        Name: "SomeTag",
                        TagType: "Base"
                    }
                })
            );
            expect(doc).toMatchSnapshot();
        });

        test("toString: Generates Appropriate Output", () => {
            expect(doc.toString()).toMatchSnapshot();
        });
    });
});
