const Rung = require("./index");
const Element = require("../element");

describe("Rung Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = (logic, num, comment = null) => () => new Rung(logic, num, comment);

            expect(fn("XIC(someTag)NOP();")).not.toThrow();
            expect(fn("XIC(someTag)NOP();", "notANum")).toThrow();
            expect(fn(null, 12)).toThrow();
            expect(fn("XIC(someTag)NOP();", 12)).not.toThrow();
            expect(fn("XIC(someTag)NOP();", 12, 12)).toThrow();
            expect(fn("XIC(someTag)NOP();", 12, "I am a Comment")).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            let rung = new Rung("XIC(someTag)NOP();", 12);
            expect(rung).toMatchSnapshot();

            rung = new Rung("XIC(someTag)NOP();", 12, "I am a comment");
            expect(rung).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isRung: Returns Appropriate Judgement", () => {
            let rung = new Rung("XIC(someTag)NOP();");
            expect(Rung.isRung(rung)).toBeTruthy();

            rung = { notARung: 12 };
            expect(Rung.isRung(rung)).toBeFalsy();

            rung = 12;
            expect(Rung.isRung(rung)).toBeFalsy();

            rung = new Element({ type: "element", name: "el" });
            expect(Rung.isRung(rung)).toBeFalsy();
        });
    });
});
