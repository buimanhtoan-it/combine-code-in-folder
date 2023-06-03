import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let combineCodeDisposable = vscode.commands.registerCommand('extension.combineCode', (uri: vscode.Uri) => {
        if (uri && uri.fsPath) {
            combineCode(uri.fsPath);
        } else {
            vscode.window.showErrorMessage('Please select a folder to combine code.');
        }
    });

    context.subscriptions.push(combineCodeDisposable);
}

function combineCode(folderPath: string) {
    const files = fs.readdirSync(folderPath);

    let combinedCode = '';

    files.forEach((file: any) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            combinedCode += fileContent + '\n\n';
        }
    });

    vscode.env.clipboard.writeText(combinedCode)
        .then(() => {
            vscode.window.showInformationMessage('Code files combined successfully and copied to the clipboard!');
        }, (error) => {
            vscode.window.showErrorMessage('Failed to copy the combined code to the clipboard: ' + error);
        });
}

export function deactivate() { }
