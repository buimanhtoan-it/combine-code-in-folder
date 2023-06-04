"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function activate(context) {
    let combineCodeDisposable = vscode.commands.registerCommand('extension.combineCode', (uri) => {
        if (uri && uri.fsPath) {
            const isDirectory = fs.statSync(uri.fsPath).isDirectory();
            if (isDirectory) {
                combineCodeFolder(uri.fsPath);
            }
            else {
                combineCodeFile(uri.fsPath);
            }
        }
        else {
            vscode.window.showErrorMessage('Please select a folder or file to combine code.');
        }
    });
    let combineCodeWithFilenamesDisposable = vscode.commands.registerCommand('extension.combineCodeWithFilenames', (uri) => {
        if (uri && uri.fsPath) {
            const isDirectory = fs.statSync(uri.fsPath).isDirectory();
            if (isDirectory) {
                combineCodeFolder(uri.fsPath, true);
            }
            else {
                combineCodeFile(uri.fsPath, true);
            }
        }
        else {
            vscode.window.showErrorMessage('Please select a folder or file to combine code with filenames.');
        }
    });
    context.subscriptions.push(combineCodeDisposable, combineCodeWithFilenamesDisposable);
}
exports.activate = activate;
function combineCodeFolder(folderPath, includeFilenames = false, rootFolderPath = folderPath) {
    const files = traverseFolder(folderPath);
    let combinedCode = '';
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const relativePath = path.relative(rootFolderPath, filePath);
            const folderName = path.basename(folderPath);
            const fileName = includeFilenames ? `// ${path.join(folderName, relativePath)}\n` : '';
            const fileContent = fs.readFileSync(filePath, 'utf8');
            combinedCode += `${fileName}${fileContent}\n\n`;
        }
    });
    vscode.env.clipboard.writeText(combinedCode)
        .then(() => {
        vscode.window.showInformationMessage('Combined code has been copied to the clipboard.', 'Paste');
    }, (error) => {
        vscode.window.showErrorMessage('Failed to copy the combined code to the clipboard: ' + error);
    });
}
function combineCodeFile(filePath, includeFilenames = false) {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const combinedCode = includeFilenames ? `// ${fileName}\n${fileContent.trim()}` : fileContent.trim();
    vscode.env.clipboard.writeText(combinedCode)
        .then(() => {
        vscode.window.showInformationMessage(`Code from '${fileName}' has been copied to the clipboard.`, 'Paste');
    }, (error) => {
        vscode.window.showErrorMessage(`Failed to copy the code from '${fileName}' to the clipboard: ${error}`);
    });
}
function traverseFolder(folderPath) {
    let result = [];
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            result.push(file);
        }
        else if (stat.isDirectory()) {
            const nestedFiles = traverseFolder(filePath);
            result = result.concat(nestedFiles.map(nestedFile => path.join(file, nestedFile)));
        }
    });
    return result;
}
function deactivate() { }
exports.deactivate = deactivate;
