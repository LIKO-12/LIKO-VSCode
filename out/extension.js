"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const docs = require("./docs.json");
var Names;
(function (Names) {
    Names["Audio"] = "Audio";
    Names["BIOS"] = "BIOS";
    Names["CPU"] = "CPU";
    Names["FDD"] = "FDD";
    Names["GPU"] = "GPU";
    Names["Gamepad"] = "Gamepad";
    Names["HDD"] = "HDD";
    Names["Keyboard"] = "Keyboard";
    Names["TouchControls"] = "TouchControls";
    Names["RAM"] = "RAM";
    Names["WEB"] = "WEB";
})(Names || (Names = {}));
var methods = {};
for (var name in Names) {
    var sub = docs.Peripherals[name].methods;
    methods = Object.assign(Object.assign({}, methods), sub);
}
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "lk12" }, new LK12DocumentSymbolProvider()));
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: "lk12" }, new LK12FoldingProvider()));
    context.subscriptions.push(vscode.languages.registerHoverProvider({ language: "lk12" }, new LK12HoverProvider()));
}
exports.activate = activate;
class LK12HoverProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            const rng = document.getWordRangeAtPosition(position);
            const word = document.getText(rng);
            if (methods[word]) {
                var method = methods[word];
                var markdown = new vscode.MarkdownString().appendMarkdown("### " + word + "\n").appendText(method.shortDescription);
                var code = "";
                var flag = false;
                if (method["usages"]) {
                    if (method.usages[0]["returns"]) {
                        var returns = method.usages[0].returns;
                        for (var ret of returns) {
                            if (flag) {
                                code += ", ";
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
                                code += ", ";
                            }
                            code += arg.name;
                            flag = true;
                        }
                    }
                    code += ")";
                }
                else {
                    if (method["returns"]) {
                        for (var ret of method.returns) {
                            if (flag) {
                                code += ", ";
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
                                code += ", ";
                            }
                            code += arg.name;
                            flag = true;
                        }
                    }
                    code += ")";
                }
                markdown.appendCodeblock(code, "lua");
                resolve({
                    contents: [markdown],
                    range: rng
                });
            }
            else {
                resolve(null);
            }
        });
    }
}
class LK12DocumentSymbolProvider {
    provideDocumentSymbols(document, token) {
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
                    });
                }
            }
            resolve(symbols);
        });
    }
}
class LK12FoldingProvider {
    provideFoldingRanges(document, context, token) {
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
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map