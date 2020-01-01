import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
        {language: "lk12"}, new LK12DocumentSymbolProvider()
    ));
    context.subscriptions.push(vscode.languages.registerFoldingRangeProvider(
        {language: "lk12"}, new LK12FoldingProvider()
    ));
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
