import * as vscode from 'vscode';
import * as docs from './docs.json';
import { resolve } from 'dns';

interface Method {
    availableSince: number[][],
    lastUpdatedIn: number[][],
    shortDescription: string,
    longDescription: string,
    arguments: {
        name: string,
        type: string,
        description: string,
        default: string
    }[],
    returns: IReturn[],
    usages ?: {
        name: string,
        returns: IReturn[],
        arguments: {
            name: string,
            type: string,
            description: string,
            default: string
        }[]
    }[]
}

interface IReturn {
    name: string,
    type: string,
    description: string
}

enum Names {
    Audio = "Audio",
    BIOS = "BIOS",
    CPU = "CPU",
    FDD = "FDD",
    GPU = "GPU",
    Gamepad = "Gamepad",
    HDD = "HDD",
    Keyboard = "Keyboard",
    TouchControls = "TouchControls",
    RAM = "RAM",
    WEB = "WEB"
}

var methods: {[id: string] : Method} = {};

for (var name in Names ) {
    var sub: {[id: string] : Method} = (docs.Peripherals as any)[name].methods;
    methods = {...methods, ...sub};
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "lk12"}, new LK12DocumentSymbolProvider()
    ));
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(
        {language: "lk12"}, new LK12FoldingProvider()
    ));
    context.subscriptions.push(vscode.languages.registerHoverProvider(
        {language: "lk12"}, new LK12HoverProvider()
    ))
}

class LK12HoverProvider implements vscode.HoverProvider {
    provideHover(document: vscode.TextDocument,
            position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return new Promise((resolve, reject) => {
                    const rng = document.getWordRangeAtPosition(position);
            const word = document.getText(rng);
            if (methods[word]) {
                var method: Method = methods[word];
                var markdown = new vscode.MarkdownString().appendMarkdown("### " + word + "\n").appendText(method.shortDescription);
                var code = "";
                var flag: boolean = false;
                if (method["usages"]) {
                    if (method.usages[0]["returns"]) {
                        var returns = method.usages[0].returns;
                        for (var ret of returns) {
                            if (flag) {
                                code += ", "
                            }
                            code += ret.name;
                            flag = true;
                        }
                        code += " = ";
                    }
                    code += word + "(";
                    flag = false;
                    if (method.usages[0]["arguments"]) {
                        var args = method.usages[0].arguments;
                        for (var arg of args) {
                            if (flag) {
                                code += ", "
                            }
                            code += arg.name;
                            flag = true;
                        }
                    }
                    code += ")"
                } else {
                    if (method["returns"]) {
                        for (var ret of method.returns) {
                            if (flag) {
                                code += ", "
                            }
                            code += ret.name;
                            flag = true;
                        }
                        code += " = ";
                    }
                    code += word + "(";
                    flag = false;
                    if (method["arguments"]) {
                        for (var arg of method.arguments) {
                            if (flag) {
                                code += ", "
                            }
                            code += arg.name;
                            flag = true;
                        }
                    }
                    code += ")"
                }
                markdown.appendCodeblock(code, "lua");
                resolve({
                    contents: [markdown],
                    range: rng
                });
            } else {
                resolve(null);
            }
        });
    }
}

class LK12DocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    public provideDocumentSymbols(document: vscode.TextDocument,
            token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        return new Promise((resolve, reject) => {
            var symbols = [];
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                if (line.text.startsWith("___")) {
                    symbols.push({
                        name: line.text.substr(3, line.text.length - 6),
                        kind: vscode.SymbolKind.Namespace,
						location: new vscode.Location(document.uri, line.range),
						containerName: line.text.substr(3, line.text.length - 6)
                    })
                }
            }
            resolve(symbols);
        });
    }
}

class LK12FoldingProvider implements vscode.FoldingRangeProvider {
    public provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext,
            token: vscode.CancellationToken): vscode.ProviderResult<vscode.FoldingRange[]> {
        return new Promise((resolve, reject) => {
            var ranges = [];
            var prev = -1;
            for (var i = 0; i < document.lineCount; i++) {
                var line = document.lineAt(i);
                if (line.text.startsWith("___")) {
                    if (prev >= 0) {
                        ranges.push({
                            start: prev,
                            end: i - 1,
                            kind: vscode.FoldingRangeKind.Region
                        });
                    }
                    prev = i;
                }
            }
            ranges.push({
                start: prev,
                end: document.lineCount - 1,
                kind: vscode.FoldingRangeKind.Region
            });
            resolve(ranges);
        });
    }
    
}

// this method is called when your extension is deactivated
export function deactivate() {}
