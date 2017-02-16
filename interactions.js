/**
 * Sets Manual signing style for a target in the pbx.Document.
 */
function setManualSigning(document, targetName) {
    document.targets
        .filter(function (target) { return target.name === targetName; })
        .forEach(function (target) {
        document.projects
            .filter(function (project) { return project.targets.indexOf(target) >= 0; })
            .forEach(function (project) {
            project.patch({
                attributes: {
                    TargetAttributes: (_a = {},
                        _a[target.key] = {
                            DevelopmentTeam: undefined /* deletes "W7TGC3P93K" */,
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
                    "CODE_SIGN_IDENTITY[sdk=iphoneos*]": undefined /* deletes the CODE_SIGN_IDENTITY[sdk=iphoneos*] */,
                    DEVELOPMENT_TEAM: ""
                }
            });
        });
    });
}
exports.setManualSigning = setManualSigning;
