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
    let combineCodeDisposable = vscode.commands.registerCommand('extension.combineCode', (...args) => {
        const uris = args.map(arg => arg instanceof vscode.Uri ? arg : arg.fsPath);
        if (uris.length > 0) {
            const filePaths = [];
            uris.forEach(uri => {
                if (uri instanceof vscode.Uri) {
                    const isDirectory = fs.statSync(uri.fsPath).isDirectory();
                    if (isDirectory) {
                        const files = traverseFolder(uri.fsPath);
                        filePaths.push(...files);
                    }
                    else {
                        filePaths.push(uri.fsPath);
                    }
                }
            });
            if (filePaths.length > 0) {
                combineCodeFiles(filePaths);
            }
            else {
                vscode.window.showErrorMessage('No files found in the selected folders.');
            }
        }
        else {
            vscode.window.showErrorMessage('Please select one or more files or folders to combine code or open a file in the editor.');
        }
    });
    let combineCodeWithFilenamesDisposable = vscode.commands.registerCommand('extension.combineCodeWithFilenames', (...args) => {
        const uris = args.map(arg => arg instanceof vscode.Uri ? arg : arg.fsPath);
        if (uris.length > 0) {
            const filePaths = [];
            uris.forEach(uri => {
                if (uri instanceof vscode.Uri) {
                    const isDirectory = fs.statSync(uri.fsPath).isDirectory();
                    if (isDirectory) {
                        const files = traverseFolder(uri.fsPath);
                        filePaths.push(...files);
                    }
                    else {
                        filePaths.push(uri.fsPath);
                    }
                }
            });
            if (filePaths.length > 0) {
                combineCodeFiles(filePaths, true);
            }
            else {
                vscode.window.showErrorMessage('No files found in the selected folders.');
            }
        }
        else {
            vscode.window.showErrorMessage('Please select one or more files or folders to combine code with filenames or open a file in the editor.');
        }
    });
    context.subscriptions.push(combineCodeDisposable, combineCodeWithFilenamesDisposable);
}
exports.activate = activate;
function combineCodeFiles(filePaths, includeFilenames = false) {
    let combinedCode = '';
    filePaths.forEach((filePath) => {
        const relativePath = getRelativePath(filePath); // Get the relative path
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const codeSnippet = includeFilenames ? `// ${relativePath}\n${fileContent.trim()}` : fileContent.trim();
        combinedCode += `${codeSnippet}\n\n`;
    });
    const codePreview = combinedCode.substr(0, 100); // Limit the code preview to 100 characters
    vscode.env.clipboard.writeText(combinedCode)
        .then(() => {
        const fileCount = filePaths.length;
        const message = `Code from ${fileCount} file${fileCount > 1 ? 's' : ''} has been copied to the clipboard.\n\nCode Preview:\n${codePreview}...`;
        vscode.window.showInformationMessage(message);
    })
        .then(undefined, (error) => {
        vscode.window.showErrorMessage('Failed to copy the combined code to the clipboard: ' + error);
    });
}
function getRelativePath(filePath) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            const folderPath = folder.uri.fsPath;
            if (filePath.startsWith(folderPath)) {
                const relativePath = path.relative(folderPath, filePath).replace(/\\/g, '/'); // Calculate the relative path and replace backslashes with forward slashes
                return relativePath;
            }
        }
    }
    return filePath;
}
function traverseFolder(folderPath) {
    let result = [];
    const files = fs.readdirSync(folderPath);
    files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            result.push(filePath);
        }
        else if (stat.isDirectory()) {
            const nestedFiles = traverseFolder(filePath);
            result.push(...nestedFiles);
        }
    });
    return result;
}
function deactivate() { }
exports.deactivate = deactivate;
