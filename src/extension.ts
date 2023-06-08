import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let combineCodeDisposable = vscode.commands.registerCommand('extension.combineCode', (...args: any[]) => {
    const uris: vscode.Uri[] = args.map(arg => arg instanceof vscode.Uri ? arg : arg.fsPath);

    if (uris.length > 0) {
      const filePaths: string[] = [];

      uris.forEach(uri => {
        if (uri instanceof vscode.Uri) {
          const isDirectory = fs.statSync(uri.fsPath).isDirectory();
          if (isDirectory) {
            const files = traverseFolder(uri.fsPath);
            filePaths.push(...files);
          } else {
            filePaths.push(uri.fsPath);
          }
        }
      });

      if (filePaths.length > 0) {
        combineCodeFiles(filePaths);
      } else {
        vscode.window.showErrorMessage('No files found in the selected folders.');
      }
    } else {
      vscode.window.showErrorMessage('Please select one or more files or folders to combine code or open a file in the editor.');
    }
  });

  let combineCodeWithFilenamesDisposable = vscode.commands.registerCommand('extension.combineCodeWithFilenames', (...args: any[]) => {
    const uris: vscode.Uri[] = args.map(arg => arg instanceof vscode.Uri ? arg : arg.fsPath);

    if (uris.length > 0) {
      const filePaths: string[] = [];

      uris.forEach(uri => {
        if (uri instanceof vscode.Uri) {
          const isDirectory = fs.statSync(uri.fsPath).isDirectory();
          if (isDirectory) {
            const files = traverseFolder(uri.fsPath);
            filePaths.push(...files);
          } else {
            filePaths.push(uri.fsPath);
          }
        }
      });

      if (filePaths.length > 0) {
        combineCodeFiles(filePaths, true);
      } else {
        vscode.window.showErrorMessage('No files found in the selected folders.');
      }
    } else {
      vscode.window.showErrorMessage('Please select one or more files or folders to combine code with filenames or open a file in the editor.');
    }
  });

  context.subscriptions.push(combineCodeDisposable, combineCodeWithFilenamesDisposable);
}

function combineCodeFiles(filePaths: string[], includeFilenames: boolean = false) {
  let combinedCode = '';

  filePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const codeSnippet = includeFilenames ? `// ${fileName}\n${fileContent.trim()}` : fileContent.trim();
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

function traverseFolder(folderPath: string): string[] {
  let result: string[] = [];

  const files = fs.readdirSync(folderPath);

  files.forEach((file: any) => {
    const filePath = path.join(folderPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      result.push(filePath);
    } else if (stat.isDirectory()) {
      const nestedFiles = traverseFolder(filePath);
      result.push(...nestedFiles);
    }
  });

  return result;
}

export function deactivate() { }
