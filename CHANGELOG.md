# Changelog

All notable changes to the "Combine Code in Folder" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2025-06-28

### Fixed
- Fixed file ordering issue where CTRL+selected files were combined in reverse order
- Files are now combined in the exact order they were selected in the explorer
- Improved file selection logic to preserve selection order while maintaining parent/child directory handling

### Technical Changes
- Replaced object-based URI storage with array-based storage to preserve selection order
- Added `isOverriddenByParentInSet()` helper function for Set-based parent directory checking
- Refactored `extractUniqueUris()` function to maintain selection order

## [1.3.2] - Previous Release

### Features
- Combine Code to Clipboard functionality
- Combine Code with Filenames functionality
- Support for multiple file and folder selection
- Context menu integration in VS Code Explorer
- Automatic file traversal for selected folders 