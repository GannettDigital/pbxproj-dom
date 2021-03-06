var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ast = require("./ast");
function isProject(obj) {
    return obj.isa === "PBXProject";
}
exports.isProject = isProject;
function isTarget(obj) {
    return obj.isa === "PBXNativeTarget";
}
exports.isTarget = isTarget;
var pbxConstructors = {};
function pbx(target) {
    target.prototype.isa = target.name;
    pbxConstructors[target.prototype.isa] = target;
}
var DocumentObject = (function () {
    function DocumentObject(document, ast) {
        this.document = document;
        this.ast = ast;
    }
    Object.defineProperty(DocumentObject.prototype, "key", {
        get: function () { return this.ast.key.json; },
        enumerable: true,
        configurable: true
    });
    DocumentObject.prototype.patch = function (json) {
        this.ast.value.patch(json);
    };
    /**
     * Override and use the ast and the document to resolve any objects referenced by hash.
     */
    DocumentObject.prototype.resolve = function () {
    };
    DocumentObject.prototype.toString = function () {
        return this.ast.toString();
    };
    return DocumentObject;
}());
exports.DocumentObject = DocumentObject;
var PBXProject = (function (_super) {
    __extends(PBXProject, _super);
    function PBXProject() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PBXProject.prototype, "targets", {
        get: function () {
            var _this = this;
            return this.ast.value.get("targets").items.map(function (key) { return _this.document[key.text]; });
        },
        enumerable: true,
        configurable: true
    });
    return PBXProject;
}(DocumentObject));
PBXProject = __decorate([
    pbx
], PBXProject);
exports.PBXProject = PBXProject;
var PBXNativeTarget = (function (_super) {
    __extends(PBXNativeTarget, _super);
    function PBXNativeTarget() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(PBXNativeTarget.prototype, "name", {
        get: function () { return this.ast.value.get("name").text; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PBXNativeTarget.prototype, "buildConfigurationsList", {
        get: function () {
            return this.document[this.ast.value.get("buildConfigurationList").text];
        },
        enumerable: true,
        configurable: true
    });
    return PBXNativeTarget;
}(DocumentObject));
PBXNativeTarget = __decorate([
    pbx
], PBXNativeTarget);
exports.PBXNativeTarget = PBXNativeTarget;
var XCBuildConfiguration = (function (_super) {
    __extends(XCBuildConfiguration, _super);
    function XCBuildConfiguration() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(XCBuildConfiguration.prototype, "name", {
        get: function () {
            return this.ast.value.get("name").text;
        },
        enumerable: true,
        configurable: true
    });
    return XCBuildConfiguration;
}(DocumentObject));
XCBuildConfiguration = __decorate([
    pbx
], XCBuildConfiguration);
exports.XCBuildConfiguration = XCBuildConfiguration;
var XCConfigurationList = (function (_super) {
    __extends(XCConfigurationList, _super);
    function XCConfigurationList() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(XCConfigurationList.prototype, "buildConfigurations", {
        get: function () {
            var _this = this;
            return this.ast.value.get("buildConfigurations").items.map(function (key) { return _this.document[key.text]; });
        },
        enumerable: true,
        configurable: true
    });
    return XCConfigurationList;
}(DocumentObject));
XCConfigurationList = __decorate([
    pbx
], XCConfigurationList);
exports.XCConfigurationList = XCConfigurationList;
var Document = (function () {
    function Document(ast) {
        this.ast = ast;
    }
    Object.defineProperty(Document.prototype, "objects", {
        get: function () {
            var _this = this;
            return Object.keys(this).map(function (key) { return _this[key]; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "targets", {
        get: function () { return this.objects.filter(isTarget); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Document.prototype, "projects", {
        get: function () { return this.objects.filter(isProject); },
        enumerable: true,
        configurable: true
    });
    Document.fromAST = function (fromAST) {
        var doc = new Document(fromAST);
        fromAST.get("objects").kvps.forEach(function (kvp) {
            if (ast.isKVPDictionary(kvp)) {
                var Ctor = pbxConstructors[kvp.value.get("isa").json];
                if (Ctor) {
                    var obj = new Ctor(doc, kvp);
                    doc[kvp.key.json] = obj;
                }
            }
        });
        return doc;
    };
    Document.prototype.toString = function () {
        return this.ast.toString();
    };
    return Document;
}());
exports.Document = Document;
function parse(project) {
    return Document.fromAST(project);
}
exports.parse = parse;
//# sourceMappingURL=pbx.js.map