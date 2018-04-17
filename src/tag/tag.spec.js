const Tag = require("./index");

describe("Tag Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = (
                name,
                datatype,
                desc = null,
                alias = null,
                safety = false,
                dim = null
            ) => () => new Tag(name, datatype, desc, alias, safety, dim);

            expect(fn("tagName")).toThrow();
            expect(fn(null, "DINT")).toThrow();
            expect(fn("tagName", "DINT")).not.toThrow();
            expect(fn("tagName", "DINT", 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description")).not.toThrow();
            expect(fn("tagName", "DINT", "A Description", 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description", "anotherTag")).not.toThrow();
            expect(fn("tagName", "DINT", "A Description", "anotherTag", 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description", "anotherTag", true)).not.toThrow();
            expect(fn("tagName", "DINT", "A Description", "anotherTag", true, 12)).toThrow();
            expect(
                fn("tagName", "DINT", "A Description", "anotherTag", true, "[10]")
            ).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            let tag = new Tag("tagName", "DINT");
            expect(tag).toMatchSnapshot();

            tag = new Tag("tagName", "DINT", "A Description");
            expect(tag).toMatchSnapshot();

            tag = new Tag("tagName", "DINT", "A Description", "anotherTag");
            expect(tag).toMatchSnapshot();

            tag = new Tag("tagName", "DINT", "A Description", "anotherTag", true);
            expect(tag).toMatchSnapshot();

            tag = new Tag("tagName", "DINT", "A Description", "anotherTag", true, "[12]");
            expect(tag).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isTag: Returns Appropriate Judgement", () => {
            let tag = new Tag("tagName", "DINT");
            expect(Tag.isTag(tag)).toBeTruthy();

            tag = { notATag: 12 };
            expect(Tag.isTag(tag)).toBeFalsy();

            tag = 12;
            expect(Tag.isTag(tag)).toBeFalsy();
        });
    });
});
