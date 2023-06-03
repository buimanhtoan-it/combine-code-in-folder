# Combine Code in Folder

Combine Code in Folder is a Visual Studio Code extension that allows you to easily combine code files within a specified folder. It provides a convenient way to merge multiple code files into a single file, making it easier to share or analyze the combined code.

## Features

- **Combine Code to Clipboard**: This option combines the code files and copies the resulting combined code to the clipboard.

- **Combine Code with Filenames**: This option combines the code files and includes the filenames in the resulting combined code, providing better context for the combined code snippets.

## Usage

To combine code using this extension, follow these steps:

1. Right-click on a folder in the Visual Studio Code Explorer.
2. Select the **Combine Code to Clipboard** option to combine the code files and copy the combined code to the clipboard.
3. Alternatively, you can choose the **Combine Code with Filenames** option to include filenames in the combined code.
4. Paste the combined code wherever you need it.

## Example

Suppose you have the following two code files in your selected folder:

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

### Combine Code to Clipboard

When you select the **Combine Code to Clipboard** option, the resulting combined code in the clipboard would be:

```javascript
console.log('Hello, world!');

function add(a, b) {
    return a + b;
}
```

### Combine Code with Filenames

When you select the **Combine Code with Filenames** option, the resulting combined code in the clipboard would be:

```javascript
// file1.js
console.log('Hello, world!');

// file2.js
function add(a, b) {
    return a + b;
}
```

## Installation

You can install the extension from the Visual Studio Code Marketplace [here](https://marketplace.visualstudio.com/items?itemName=ToanBui.combine-code-in-folder).

## Feedback

If you have any feedback or issues, please submit them on the [GitHub repository](https://github.com/buimanhtoan-it/combine-code-in-folder/issues).
