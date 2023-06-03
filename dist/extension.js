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
            combineCode(uri.fsPath);
        }
        else {
            vscode.window.showErrorMessage('Please select a folder to combine code.');
        }
    });
    let combineCodeWithFilenamesDisposable = vscode.commands.registerCommand('extension.combineCodeWithFilenames', (uri) => {
        if (uri && uri.fsPath) {
            combineCode(uri.fsPath, true);
        }
        else {
            vscode.window.showErrorMessage('Please select a folder to combine code with filenames.');
        }
    });
    context.subscriptions.push(combineCodeDisposable, combineCodeWithFilenamesDisposable);
}
exports.activate = activate;
function combineCode(folderPath, includeFilenames = false) {
    const files = fs.readdirSync(folderPath);
    let combinedCode = '';
    let filenames = '';
    files.forEach((file) => {
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
function deactivate() { }
exports.deactivate = deactivate;
