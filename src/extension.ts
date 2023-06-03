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

    let combineCodeWithFilenamesDisposable = vscode.commands.registerCommand('extension.combineCodeWithFilenames', (uri: vscode.Uri) => {
        if (uri && uri.fsPath) {
            combineCode(uri.fsPath, true);
        } else {
            vscode.window.showErrorMessage('Please select a folder to combine code with filenames.');
        }
    });

    context.subscriptions.push(combineCodeDisposable, combineCodeWithFilenamesDisposable);
}

function combineCode(folderPath: string, includeFilenames: boolean = false) {
    const files = fs.readdirSync(folderPath);

    let combinedCode = '';
    let filenames = '';

    files.forEach((file: any) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const fileName = includeFilenames ? `// ${path.basename(filePath)}\n` : '';
            const fileContent = fs.readFileSync(filePath, 'utf8');
            combinedCode += `${fileName}${fileContent}\n\n`;
            filenames += `${file}\n`;
        }
    });

    vscode.env.clipboard.writeText(combinedCode)
        .then(() => {
            vscode.window.showInformationMessage('Combined code has been copied to the clipboard.', 'Paste');
        }, (error) => {
            vscode.window.showErrorMessage('Failed to copy the combined code to the clipboard: ' + error);
        });
}

export function deactivate() { }
