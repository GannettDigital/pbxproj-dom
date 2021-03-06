var ast = require("./parser");
var xcode_1 = require("./xcode");
var chai_1 = require("chai");
var fs = require("fs");
describe("parser", function () {
    describe("roundtrips", function () {
        [
            "tests/simple.pbxproj",
            "tests/proj0.pbxproj",
            "tests/proj1.pbxproj",
            "tests/proj2.pbxproj",
            "tests/signing-style/manual.pbxproj",
            "tests/signing-style/automatic.pbxproj"
        ].forEach(function (f) { return it(f, function () {
            var str = fs.readFileSync(f).toString();
            var parsed = ast.parse(str);
            var out = parsed.toString();
            chai_1.assert.equal(out, str, "Expect parse and toString to roundtrip");
        }); });
    });
});
describe("dom", function () {
    it("can set signing style from automatic to manual", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/automatic.pbxproj");
        xcode.setManualSigningStyle("SampleProvProfApp");
        var expected = fs.readFileSync("tests/signing-style/manual.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can set signing style from manual to automatic", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/manual.pbxproj");
        xcode.setAutomaticSigningStyle("SampleProvProfApp", "W7TGC3P93K");
        var expected = fs.readFileSync("tests/signing-style/automatic.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can upgrade signing style from none to manual", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/none.pbxproj");
        xcode.setManualSigningStyle("SampleProvProfApp");
        var expected = fs.readFileSync("tests/signing-style/manual.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can upgrade signing style from none to manual with specific provisioning profile for all targets", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/none.pbxproj");
        xcode.setManualSigningStyle("SampleProvProfApp", {
            uuid: "a62743b2-2513-4488-8d83-bad5f3b6716d",
            name: "NativeScriptDevProfile",
            team: "W7TGC3P93K"
        });
        var expected = fs.readFileSync("tests/signing-style/manual-with-provisioning.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can upgrade signing style from automatic to manual with specific provisioning profile for all targets", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/automatic.pbxproj");
        xcode.setManualSigningStyle("SampleProvProfApp", {
            uuid: "a62743b2-2513-4488-8d83-bad5f3b6716d",
            name: "NativeScriptDevProfile",
            team: "W7TGC3P93K"
        });
        var expected = fs.readFileSync("tests/signing-style/manual-with-provisioning.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can upgrade signing style from none to automatic", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/none.pbxproj");
        xcode.setAutomaticSigningStyle("SampleProvProfApp", "W7TGC3P93K");
        var expected = fs.readFileSync("tests/signing-style/automatic.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can upgrade signing style from manual with specific provisioning profile to automatic", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/manual-with-provisioning.pbxproj");
        xcode.setAutomaticSigningStyle("SampleProvProfApp", "W7TGC3P93K");
        var expected = fs.readFileSync("tests/signing-style/automatic.pbxproj").toString();
        chai_1.assert.equal(xcode.toString(), expected);
    });
    it("can read signing style of autmatically signed target", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/automatic.pbxproj");
        var signing = xcode.getSigning("SampleProvProfApp");
        chai_1.assert.deepEqual(signing, { style: "Automatic", team: "W7TGC3P93K" });
    });
    it("can read signing style of manually signed target", function () {
        var xcode = xcode_1.Xcode.open("tests/signing-style/manual-with-provisioning.pbxproj");
        var signing = xcode.getSigning("SampleProvProfApp");
        chai_1.assert.deepEqual(signing, {
            style: "Manual",
            configurations: {
                "Debug": {
                    uuid: 'a62743b2-2513-4488-8d83-bad5f3b6716d',
                    name: 'NativeScriptDevProfile',
                    identity: undefined,
                    team: 'W7TGC3P93K'
                },
                "Release": {
                    uuid: 'a62743b2-2513-4488-8d83-bad5f3b6716d',
                    name: 'NativeScriptDevProfile',
                    identity: undefined,
                    team: 'W7TGC3P93K'
                }
            }
        });
    });
});
//# sourceMappingURL=test.js.map