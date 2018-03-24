const xml2js = require("xml2js");
const fs = require("fs");
const util = require("util");
const path = require("path");

let parser = new xml2js.Parser({ strict: false });
var builder = new xml2js.Builder({ renderOpts: { pretty: false }, cdata: true });
const PATH = path.join(__dirname, "PB_OneButton.L5X");

fs.readFile(PATH, (err, data) => {
    parser.parseString(data, (err, result) => {
        let xml = builder.buildObject(result);
        console.log(util.inspect(xml, false, null));
    });
});
