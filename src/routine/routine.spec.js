const Routine = require("./index");

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
