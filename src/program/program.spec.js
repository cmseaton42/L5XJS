const Program = require("./index");
const Tag = require("../tag");
const Routine = require("../routine");
const Rung = require("../rung");

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

        test("addRoutine: Throws on Invalid Input", () => {
            const fn = rout => () => prog.addRoutine(rout);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn("notATag")).toThrow();
        });

        test("addRoutine: Adds Routine Program Instance", () => {
            prog.addRoutine(new Routine("aRoutine"));
            expect(prog).toMatchSnapshot();

            prog.addRoutine(new Routine("bRoutine"));
            expect(prog).toMatchSnapshot();

            const rout = new Routine("cRoutine");
            prog.addRoutine(rout);
            expect(prog).toMatchSnapshot();

            rout.addRung(new Rung("XIC(someTag)NOP();"));
            expect(prog).toMatchSnapshot();
        });

        test("findTag: Throws on Invalid Input", () => {
            const fn = name => () => prog.findTag(name);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn(12)).toThrow();
            expect(fn("aTag")).not.toThrow();
        });

        test("findTag: Finds Target Tag", () => {
            prog.addTag(new Tag("aTag", "DINT"));
            prog.addTag(new Tag("bTag", "SINT"));

            const tag = new Tag("cTag", "BOOL");
            prog.addTag(tag);

            expect(prog.findTag("aTag")).not.toBeNull();
            expect(prog.findTag("aTag")).toMatchSnapshot();
            expect(prog.findTag("bTag")).not.toBeNull();
            expect(prog.findTag("bTag")).toMatchSnapshot();
            expect(prog.findTag("cTag")).not.toBeNull();
            expect(prog.findTag("cTag")).toMatchSnapshot();
            expect(prog.findTag("dTag")).toBeNull();

            prog.findTag("cTag").dom.attributes.Name = "eTag";
            expect(prog).toMatchSnapshot();
            expect(tag).toMatchSnapshot();
        });

        test("findRoutine: Throws on Invalid Input", () => {
            const fn = name => () => prog.findRoutine(name);

            expect(fn(new Program("notATag"))).toThrow();
            expect(fn(12)).toThrow();
            expect(fn("aRoutine")).not.toThrow();
        });

        test("findRoutine: Finds Target Routine", () => {
            prog.addRoutine(new Routine("aRoutine"));
            prog.addRoutine(new Routine("bRoutine"));

            const rout = new Routine("cRoutine");
            prog.addRoutine(rout);

            expect(prog.findRoutine("aRoutine")).not.toBeNull();
            expect(prog.findRoutine("aRoutine")).toMatchSnapshot();
            expect(prog.findRoutine("bRoutine")).not.toBeNull();
            expect(prog.findRoutine("bRoutine")).toMatchSnapshot();
            expect(prog.findRoutine("cRoutine")).not.toBeNull();
            expect(prog.findRoutine("cRoutine")).toMatchSnapshot();
            expect(prog.findRoutine("dRoutine")).toBeNull();

            rout.addRung(new Rung("XIC(someTag)NOP();"));
            expect(prog.findRoutine("cRoutine")).not.toBeNull();
            expect(prog.findRoutine("cRoutine")).toMatchSnapshot();
            expect(prog).toMatchSnapshot();

            prog.findRoutine("aRoutine").addRung(new Rung("XIC(anotherTag)NOP();"));
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
