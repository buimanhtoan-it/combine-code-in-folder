import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let combineCodeDisposable = vscode.commands.registerCommand('extension.combineCode', (...args: any[]) => {
    const uris: vscode.Uri[] = extractUniqueUris(args);

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
    const uris: vscode.Uri[] = extractUniqueUris(args);

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

function extractUniqueUris(args: any[]): vscode.Uri[] {
  const flatArgs = flattenArray(args);

  const orderedUris: vscode.Uri[] = [];
  const pathSet: Set<string> = new Set();

  flatArgs.forEach(arg => {
    if (arg instanceof vscode.Uri) {
      const path = arg.fsPath;
      if (!pathSet.has(path) && !isOverriddenByParentInSet(path, pathSet)) {
        const indicesToRemove: number[] = [];
        orderedUris.forEach((existingUri, index) => {
          if (existingUri.fsPath.startsWith(path) && existingUri.fsPath !== path) {
            indicesToRemove.push(index);
            pathSet.delete(existingUri.fsPath);
          }
        });
        
        indicesToRemove.reverse().forEach(index => {
          orderedUris.splice(index, 1);
        });

        orderedUris.push(arg);
        pathSet.add(path);
      }
    }
  });

  return orderedUris;
}

function flattenArray(arr: any[]): any[] {
  return arr.reduce((acc: any[], item: any) => {
    return Array.isArray(item)
      ? acc.concat(flattenArray(item))
      : acc.concat(item);
  }, []);
}

function isOverriddenByParent(path: string, uriMap: { [path: string]: vscode.Uri }): boolean {
  for (const existingPath in uriMap) {
    if (path.startsWith(existingPath) && path !== existingPath) {
      return true; 
    }
  }
  return false;
}

function isOverriddenByParentInSet(path: string, pathSet: Set<string>): boolean {
  for (const existingPath of pathSet) {
    if (path.startsWith(existingPath) && path !== existingPath) {
      return true; 
    }
  }
  return false;
}

function combineCodeFiles(filePaths: string[], includeFilenames: boolean = false) {
  let combinedCode = '';

  filePaths.forEach((filePath) => {
    const relativePath = getRelativePath(filePath); 
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const codeSnippet = includeFilenames ? `// ${relativePath}\n${fileContent.trim()}` : fileContent.trim();
    combinedCode += `${codeSnippet}\n\n`;
  });

  const codePreview = combinedCode.substr(0, 100); 

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

function getRelativePath(filePath: string): string {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders) {
    for (const folder of workspaceFolders) {
      const folderPath = folder.uri.fsPath;
      if (filePath.startsWith(folderPath)) {
        const relativePath = path.relative(folderPath, filePath).replace(/\\/g, '/'); 
        return relativePath;
      }
    }
  }

  return filePath;
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
