# LIKO-12 Language Extension

VS Code extension for the LIKO-12 cartridge format

## Features

### Syntax Highlighting

This extension syntax hightlights the LIKO-12 format by splitting it into four sections, and working with each one seperately.

- Lua Code: this section is treated as lua source code, using default syntax highlighting.
![lua code](images/code.png)

- Tilemap: this one is parsed as integers.
- Spritesheet: also this one is parsed as integers.
- Sfx: this section though, is treated as a special compound type.

### Parsing

- Folding: Each of the four sections is able to be folded.
- Outline: Each of the also appears in the outline.
- Hover: For functions from LIKO-12 libraries, there are explanations when hovered.
- Linting: If luacheck is installed it could lint the lua code section on save.

## Requirements

If you want linting available, you need it to be installed and in the path.

## Extension Settings

liko12.luacheck - the path to luacheck or null to disable.

## Known Issues

There are no currently known issues, but if you find any do not hesistate to add them to the tracker.

## Release Notes

### 1.0.0

Initial release of this extension