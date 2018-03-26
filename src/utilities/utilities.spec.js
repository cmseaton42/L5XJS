const { hash } = require("./index");

describe("Utilities", () => {
    test("hash: Produces Correct Output", () => {
        expect(hash("hello world") === hash("hello world")).toBeTruthy();
        expect(hash("I am a document") === hash("I am a document")).toBeTruthy();
    })
});
