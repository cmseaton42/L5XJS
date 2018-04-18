const Member = require("./index");

describe("Member Class", () => {
    describe("New Instance", () => {
        it("Accepts Proper Input", () => {
            const fn = (
                name,
                datatype,
                desc = null,
                hidden = false,
                target = null,
                bit = null
            ) => () => new Member(name, datatype, desc, hidden, target, bit);

            expect(fn("tagName")).toThrow();
            expect(fn(null, "DINT")).toThrow();
            expect(fn("tagName", "DINT")).not.toThrow();
            expect(fn("tagName", "DINT", 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description")).not.toThrow();
            expect(fn("tagName", "DINT", "A Description", 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description", true)).not.toThrow();
            expect(fn("tagName", "DINT", "A Description", true, 12)).toThrow();
            expect(fn("tagName", "DINT", "A Description", true, "aTarget")).not.toThrow();
            expect(
                fn("tagName", "DINT", "A Description", true, "aTarget", "notANumber")
            ).toThrow();
            expect(fn("tagName", "DINT", "A Description", true, null, 12)).toThrow();
            expect(
                fn("tagName", "DINT", "A Description", true, "aTarget", 12)
            ).not.toThrow();
        });

        it("Initializes with Desired Document Model", () => {
            let mem = new Member("tagName", "DINT");
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "BOOL", null, false, "aTarget", 0);
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "BIT", null, false, "aTarget", 0);
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "DINT", "A Description");
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "DINT", "A Description", true);
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "DINT", "A Description", false, "ATarget");
            expect(mem).toMatchSnapshot();

            mem = new Member("tagName", "DINT", "A Description", false, "ATarget", 12);
            expect(mem).toMatchSnapshot();
        });
    });

    describe("Static Methods", () => {
        test("isMember: Returns Appropriate Judgement", () => {
            let mem = new Member("tagName", "DINT");
            expect(Member.isMember(mem)).toBeTruthy();

            mem = { notATag: 12 };
            expect(Member.isMember(mem)).toBeFalsy();

            mem = 12;
            expect(Member.isMember(mem)).toBeFalsy();
        });
    });
});
