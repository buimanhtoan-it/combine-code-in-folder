# Combine Code in Folder

Combine Code in Folder is a Visual Studio Code extension that allows you to easily combine code files within a specified folder. It provides a convenient way to merge multiple code files into a single file, making it easier to share or analyze the combined code.

## Features

- **Combine Code to Clipboard**: This option combines the code files and copies the resulting combined code to the clipboard.

- **Combine Code with Filenames**: This option combines the code files and includes the filenames in the resulting combined code, providing better context for the combined code snippets.

- **Compatibility with ChatGPT**: The extension's ability to preserve the folder/project structure when combining code files makes it useful for analyzing code in the context of project organization. When pasting the combined code into ChatGPT, it can understand and analyze the structure of the project or folder.

## Usage

To combine code using this extension and utilize it with ChatGPT, follow these steps:

1. Right-click on a folder in the Visual Studio Code Explorer.
2. Select the **Combine Code to Clipboard** option to combine the code files and copy the combined code to the clipboard.
3. Alternatively, you can choose the **Combine Code with Filenames** option to include filenames in the combined code.
4. Paste the combined code into ChatGPT for analysis, discussions, code reviews, or seeking assistance. ChatGPT will be able to understand and analyze the code within the context of the project's folder structure.

With this extension, you can easily share code snippets with ChatGPT and have meaningful discussions or receive valuable insights based on the project's folder structure.

## Example

Suppose you have the following folder structure with code files:

```
**Project Structure:**

- RootFolder
  |- Subfolder1
  |  |- file1.js
  |  |- Subfolder2
  |     |- file3.js
  |- Subfolder3
     |- file2.js

```

**File 1: `file1.js`**
```javascript
console.log('Hello, world!');
```

**File 2: `file2.js`**
```javascript
function add(a, b) {
    return a + b;
}
```

**File 3: `file3.js`**
```javascript
function subtract(a, b) {
    return a - b;
}
```

### Combine Code to Clipboard

When you select the **Combine Code to Clipboard** option on the `RootFolder` level, the resulting combined code in the clipboard would be:

```javascript
console.log('Hello, world!');

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}
```

### Combine Code with Filenames

When you select the **Combine Code with Filenames** option on the `RootFolder` level, the resulting combined code in the clipboard would be:

```javascript
// RootFolder/Subfolder1/file1.js
console.log('Hello, world!');

// RootFolder/Subfolder3/file2.js
function add(a, b) {
    return a + b;
}

// RootFolder/Subfolder1/Subfolder2/file3.js
function subtract(a, b) {
    return a - b;
}
```

In this example, the code files from nested deeper folders (`Subfolder2` and its contents) are combined as well, and the relative paths with the root folder's name are included in the resulting combined code.

## Installation

You can install the extension from the Visual Studio Code Marketplace [here](https://marketplace.visualstudio.com/items?itemName=To

anBui.combine-code-in-folder).

## Donate

If you find this extension helpful and would like to support its development, consider donating to the project's Patreon page:

[![Patreon](https://img.shields.io/badge/support-patreon-F96854.svg)](https://patreon.com/ToanBui)

Your contribution will help in maintaining and improving this extension. Thank you for your support!

## Change Log

- **v1.2.6** (June 13, 2023): Fixed an issue with relative path handling when combining code files.

## Feedback

If you have any feedback or issues, please submit them on the [GitHub repository](https://github.com/buimanhtoan-it/combine-code-in-folder/issues).