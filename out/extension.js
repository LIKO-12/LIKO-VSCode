"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function activate(context) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider({ language: "lk12" }, new LK12DocumentSymbolProvider()));
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider({ language: "lk12" }, new LK12FoldingProvider()));
}
exports.activate = activate;
var colorRE = /[0-9A-Fa-f]/;
let colors = [
    new vscode.Color(0, 0, 0, 255),
    new vscode.Color(28, 43, 83, 255),
    new vscode.Color(127, 36, 84, 255),
    new vscode.Color(0, 135, 81, 255),
    new vscode.Color(171, 82, 54, 255),
    new vscode.Color(96, 88, 79, 255),
    new vscode.Color(195, 195, 198, 255),
    new vscode.Color(255, 241, 233, 255),
    new vscode.Color(237, 27, 81, 255),
    new vscode.Color(250, 162, 27, 255),
    new vscode.Color(247, 236, 47, 255),
    new vscode.Color(93, 187, 77, 255),
    new vscode.Color(81, 166, 220, 255),
    new vscode.Color(131, 118, 156, 255),
    new vscode.Color(241, 118, 166, 255),
    new vscode.Color(252, 204, 171, 255)
];
function getIndex(char) {
    switch (char) {
        case "0":
            return 0;
        case "1":
            return 1;
        case "2":
            return 2;
        case "3":
            return 3;
        case "4":
            return 4;
        case "5":
            return 5;
        case "6":
            return 6;
        case "7":
            return 7;
        case "8":
            return 8;
        case "9":
            return 9;
        case "A":
            return 10;
        case "B":
            return 11;
        case "C":
            return 12;
        case "D":
            return 13;
        case "E":
            return 14;
        case "F":
            return 15;
        default:
            return 0;
    }
}
class LK12ColorProvider {
    provideDocumentColors(document, token) {
        return new Promise((resolve, reject) => {
            var info = [];
            var text = document.getText.toString();
            var header = "___spritesheet___\nLK12;GPUIMG;192x128;\n";
            var start = text.indexOf(header);
            if (start != -1) {
                var pos = start + header.length + 2;
                while (colorRE.test(text.charAt(pos))) {
                    info.push({
                        range: new vscode.Range(document.positionAt(pos), document.positionAt(pos + 1)),
                        color: colors[getIndex(text.charAt(pos))]
                    });
                }
                pos++;
            }
            resolve(info);
        });
    }
    provideColorPresentations(color, context, token) {
        return new Promise((resolve, reject) => {
            var presentations = [];
            let label = colors.indexOf(color);
            if (label == -1) {
                label = 0;
            }
            resolve([new vscode.ColorPresentation(label.toString())]);
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