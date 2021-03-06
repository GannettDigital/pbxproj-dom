import * as ast from "./ast";
export declare function isProject(obj: DocumentObject): obj is PBXProject;
export declare function isTarget(obj: DocumentObject): obj is PBXNativeTarget;
export declare type ISA = "PBXProject" | "PBXNativeTarget" | "XCBuildConfiguration" | "XCConfigurationList";
export declare class DocumentObject {
    protected document: Document;
    ast: ast.KeyValuePair<ast.Dictionary>;
    isa: ISA;
    constructor(document: Document, ast: ast.KeyValuePair<ast.Dictionary>);
    readonly key: string;
    patch(json: any): void;
    /**
     * Override and use the ast and the document to resolve any objects referenced by hash.
     */
    protected resolve(): void;
    toString(): string;
}
export declare class PBXProject extends DocumentObject {
    readonly targets: PBXNativeTarget[];
}
export declare class PBXNativeTarget extends DocumentObject {
    readonly name: string;
    readonly buildConfigurationsList: XCConfigurationList;
}
export declare class XCBuildConfiguration extends DocumentObject {
    readonly name: string;
}
export declare class XCConfigurationList extends DocumentObject {
    readonly buildConfigurations: XCBuildConfiguration[];
}
export declare class Document {
    protected ast: ast.Document;
    [id: string]: DocumentObject | any;
    private constructor(ast);
    readonly objects: DocumentObject[];
    readonly targets: PBXNativeTarget[];
    readonly projects: PBXProject[];
    static fromAST(fromAST: ast.Document): Document;
    toString(): string;
}
export declare function parse(project: ast.Document): Document;
