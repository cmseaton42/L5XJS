const Program = require("./index");
const Tag = require("../tag");

describe("Program Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = (name, desc = null, safety = false) => () => new Program(name, desc, safety);

            expect(fn("ProgramName")).not.toThrow();
            expect(fn(null, "A Program Description")).toThrow();
            expect(fn("ProgramName", 12)).toThrow();
            expect(fn("ProgramName", "A Program Description")).not.toThrow();
            expect(fn("ProgramName", "A Program Description", 12)).toThrow();
            expect(fn("ProgramName", "A Program Description", true)).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            let program = new Program("ProgramName");
            expect(program).toMatchSnapshot();

            program = new Program("ProgramName", "A Description");
            expect(program).toMatchSnapshot();

            program = new Program("ProgramName", "A Description", true);
            expect(program).toMatchSnapshot();
        });
    });

    describe("Methods", () => {
        let prog;

        beforeEach(() => {
            prog = new Program("testProg");
        });

        test("_orderify: Results in the Correct Order", () => {
            prog.dom.elements.push({
                type: "element",
                name: "Tags",
                elements: []
            });

            prog.dom.elements.push({
                type: "element",
                name: "Routines",
                elements: []
            });

            prog.dom.elements.push({
                type: "element",
                name: "Description",
                elements: []
            });

            prog._orderify();

            expect(prog).toMatchSnapshot();
        });

        test("addTag: Throws on Invalid Input", () => {
            const fn = tag => () => prog.addTag(tag);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn("notATag")).toThrow();
        });

        test("addTag: Adds Tag Program Instance", () => {
            prog.addTag(new Tag("tag1", "BOOL"));
            expect(prog).toMatchSnapshot();

            prog.addTag(new Tag("tag2", "DINT"));
            expect(prog).toMatchSnapshot();

            prog.dom.elements.push({
                type: "element",
                name: "Description",
                elements: [
                    {
                        type: "cdata",
                        cdata: "A Cool Program Description"
                    }
                ]
            });

            prog.addTag(new Tag("tag3", "SINT"));
            expect(prog).toMatchSnapshot();

            const tag4 = new Tag("tag4", "REAL");
            prog.addTag(tag4);
            expect(prog).toMatchSnapshot();

            tag4.dom.attributes.Name = "not_tag4Anymore";
            expect(prog).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isProgram: Returns Appropriate Judgement", () => {
            let program = new Program("ProgramName", "A Description");
            expect(Program.isProgram(program)).toBeTruthy();

            program = { notAProgram: 12 };
            expect(Program.isProgram(program)).toBeFalsy();

            program = 12;
            expect(Program.isProgram(program)).toBeFalsy();
        });
    });
});
