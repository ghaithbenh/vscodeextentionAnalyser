import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.analyzeCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();

            const diagnostics: vscode.Diagnostic[] = [];
            const regExp = /[A-Z]/g;

            for (let line = 0; line < document.lineCount; line++) {
                const lineText = document.lineAt(line).text;
                
                // Check for uppercase letters
                let match;
                while ((match = regExp.exec(lineText)) !== null) {
                    const range = new vscode.Range(line, match.index, line, match.index + 1);
                    const diagnostic = new vscode.Diagnostic(range, 'Uppercase letter found', vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                }

                // Check for missing semicolons
                if (!lineText.trim().endsWith(';') && lineText.trim() !== '' && !lineText.trim().startsWith('//')) {
                    const range = new vscode.Range(line, lineText.length - 1, line, lineText.length);
                    const diagnostic = new vscode.Diagnostic(range, 'Missing semicolon', vscode.DiagnosticSeverity.Warning);
                    diagnostics.push(diagnostic);
                }
            }

            const diagnosticCollection = vscode.languages.createDiagnosticCollection('codeAnalysis');
            diagnosticCollection.set(document.uri, diagnostics);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
