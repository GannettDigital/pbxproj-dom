var parser = require("./parser");
var pbx = require("./pbx");
var fs = require("fs");
/**
 * Facade encapsulating common Xcode interractions.
 */
var Xcode = (function () {
    function Xcode() {
    }
    /**
     * Opens an existing Xcode project file.
     */
    Xcode.open = function (path) {
        var xcode = new Xcode();
        xcode.document = pbx.parse(parser.parse(fs.readFileSync(path).toString()));
        xcode.path = path;
        return xcode;
    };
    /**
     * Save the project back to the project file.
     */
    Xcode.prototype.save = function () {
        fs.writeFileSync(this.path, this.toString(), { encoding: 'utf8' });
    };
    /**
     * Sets Manual signing style for a target in the pbx.Document.
     */
    Xcode.prototype.setManualSigningStyle = function (targetName, _a) {
        var _this = this;
        var _b = _a === void 0 ? { team: undefined, uuid: undefined, name: undefined } : _a, team = _b.team, uuid = _b.uuid, name = _b.name, identity = _b.identity;
        this.document.targets
            .filter(function (target) { return target.name === targetName; })
            .forEach(function (target) {
            _this.document.projects
                .filter(function (project) { return project.targets.indexOf(target) >= 0; })
                .forEach(function (project) {
                project.patch({
                    attributes: {
                        TargetAttributes: (_a = {},
                            _a[target.key] = {
                                DevelopmentTeam: team,
                                ProvisioningStyle: "Manual"
                            },
                            _a)
                    }
                });
                var _a;
            });
            target.buildConfigurationsList.buildConfigurations.forEach(function (config) {
                config.patch({
                    buildSettings: {
                        "CODE_SIGN_IDENTITY[sdk=iphoneos*]": identity /* delete or set the CODE_SIGN_IDENTITY[sdk=iphoneos*] */,
                        DEVELOPMENT_TEAM: team || "",
                        PROVISIONING_PROFILE: uuid,
                        PROVISIONING_PROFILE_SPECIFIER: name
                    }
                });
            });
        });
    };
    /**
     * Sets Automatic signing style for a target in the pbx.Document.
     */
    Xcode.prototype.setAutomaticSigningStyle = function (targetName, developmentTeam) {
        var _this = this;
        this.document.targets
            .filter(function (target) { return target.name === targetName; })
            .forEach(function (target) {
            _this.document.projects
                .filter(function (project) { return project.targets.indexOf(target) >= 0; })
                .forEach(function (project) {
                project.patch({
                    attributes: {
                        TargetAttributes: (_a = {},
                            _a[target.key] = {
                                DevelopmentTeam: developmentTeam,
                                ProvisioningStyle: "Automatic"
                            },
                            _a)
                    }
                });
                var _a;
            });
            target.buildConfigurationsList.buildConfigurations.forEach(function (config) {
                config.patch({
                    buildSettings: {
                        "CODE_SIGN_IDENTITY[sdk=iphoneos*]": "iPhone Developer",
                        DEVELOPMENT_TEAM: developmentTeam,
                        PROVISIONING_PROFILE: undefined,
                        PROVISIONING_PROFILE_SPECIFIER: undefined
                    }
                });
            });
        });
    };
    /**
     * Read the signing configuration for a target.
     */
    Xcode.prototype.getSigning = function (targetName) {
        for (var _i = 0, _a = this.document.projects; _i < _a.length; _i++) {
            var project = _a[_i];
            for (var _b = 0, _c = project.targets; _b < _c.length; _b++) {
                var target = _c[_b];
                if (target.name === targetName) {
                    var targetAttributes = project.ast.get("attributes").get("TargetAttributes").get(target.key);
                    var style = targetAttributes.get("ProvisioningStyle").text;
                    var team = targetAttributes.get("DevelopmentTeam").text;
                    if (style === "Automatic") {
                        return { style: style, team: team };
                    }
                    else if (style === "Manual") {
                        var configurations = {};
                        for (var _d = 0, _e = target.buildConfigurationsList.buildConfigurations; _d < _e.length; _d++) {
                            var config = _e[_d];
                            var buildSettings = config.ast.get("buildSettings");
                            var uuid = buildSettings.get("PROVISIONING_PROFILE").text;
                            var name = buildSettings.get("PROVISIONING_PROFILE_SPECIFIER").text;
                            var identity = buildSettings.get("CODE_SIGN_IDENTITY[sdk=iphoneos*]").text;
                            var team_1 = buildSettings.get("DEVELOPMENT_TEAM").text;
                            configurations[config.name] = { uuid: uuid, name: name, identity: identity, team: team_1 };
                        }
                        return { style: style, configurations: configurations };
                    }
                    else {
                        return undefined;
                    }
                }
            }
        }
        return undefined;
    };
    /**
     * Serializes the project back to string format.
     */
    Xcode.prototype.toString = function () {
        return this.document.toString();
    };
    return Xcode;
}());
exports.Xcode = Xcode;
//# sourceMappingURL=xcode.js.map