const Document = require("./index");

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

    describe("Public Methods", () => {
        let docFull;
        let docEmpty;

        beforeEach(() => {
            docFull = new Document("./__test-data__/datatype.L5X");
            docEmpty = new Document();
        });

        test("Find: Finds Document Elements", () => {
            expect(docFull.find("nothing")).toBe(null);
            expect(docEmpty.find("nothing")).toBe(null);

            expect(docFull.find("Controller")).not.toBe(null);
            expect(docFull.find("Controller")).toMatchSnapshot();

            expect(docEmpty.find("Controller")).not.toBe(null);
            expect(docEmpty.find("Controller")).toMatchSnapshot();

            expect(docFull.find("Member", { Name: "Push" })).not.toBe(null);
            expect(docEmpty.find("Member", { Name: "Push" })).toBe(null);

            expect(docFull.find("Member", { Name: "Push" })).toMatchSnapshot();
            //expect(docFull.find(""));
        });

        test("Find: Rejects Invalid Inputs", () => {
            const fn = (type, attr, tree) => () => docFull.find(type, attr, tree);

            expect(fn(12, null, null)).toThrow();
            expect(fn("Controller", null, null)).not.toThrow();
            expect(fn("Controller", 12, null)).toThrow();
            expect(fn("Controller", { Name: "another" }, null)).not.toThrow();
            expect(fn("Controller", { Name: "another" }, 12)).toThrow();
            expect(fn("Controller", { Name: "another" }, {} )).not.toThrow();
        });
    });
});
