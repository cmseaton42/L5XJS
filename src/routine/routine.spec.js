const Routine = require("./index");
const Element = require("../element");
const Rung = require("../rung");

describe("Routine Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = (name, desc = null) => () => new Routine(name, desc);

            expect(fn()).toThrow();
            expect(fn(12)).toThrow();
            expect(fn("IamRoutine")).not.toThrow();
            expect(fn("IamRoutine", 12)).toThrow();
            expect(fn("IamRoutine", "I am a decription")).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            let routine = new Routine("ARoutine");
            expect(routine).toMatchSnapshot();

            routine = new Routine("ARoutine", "I am a description");
            expect(routine).toMatchSnapshot();
        });
    });

    describe("Methods", () => {
        let rout;

        beforeEach(() => {
            rout = new Routine("IamRoutine");
        });

        test("addRung: Throws on Invalid Input", () => {
            const fn = rung => () => rout.addRung(rung);

            expect(fn(new Rung("XIC(someTag)NOP();"))).not.toThrow();
            expect(fn(new Element({ type: "element", name: "el" }))).toThrow();
        });

        test("addRung: Produces Desired Doc Model", () => {
            const r1 = new Rung("XIC(someTag)NOP();");
            rout.addRung(r1);
            expect(rout).toMatchSnapshot();

            r1.dom.attributes.Number = 1;
            expect(rout).toMatchSnapshot();

            r1.dom.attributes.Number = 0;
            rout.addRung(new Rung("XIC(anotherTag)NOP();"));
            expect(rout).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isRoutine: Returns Appropriate Judgement", () => {
            let routine = new Routine("ARoutine");
            expect(Routine.isRoutine(routine)).toBeTruthy();

            routine = { notARoutine: 12 };
            expect(Routine.isRoutine(routine)).toBeFalsy();

            routine = 12;
            expect(Routine.isRoutine(routine)).toBeFalsy();
        });
    });
});
