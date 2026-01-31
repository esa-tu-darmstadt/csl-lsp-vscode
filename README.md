# CSL Language Server

Language server for Cerebras Software Language (CSL) providing rich editor features beyond syntax highlighting.

![CSL Language Server in action](images/demo.gif)

## Features

- **Diagnostics** -- real-time error and warning reporting as you type
- **Hover** -- type information and documentation on hover
- **Go to Definition** -- jump to the definition of functions, variables, and imports
- **Document Symbols** -- outline view and symbol search within a file

## Settings

Configure the extension under `csl.*` in your VS Code settings:

| Setting                | Description                                              | Default     |
|------------------------|----------------------------------------------------------|-------------|
| `csl.serverPath`       | Override path to the LSP server binary. Leave empty to use the bundled binary. | (empty) |
| `csl.arch`             | Target architecture.                                     | `wse2`      |
| `csl.systemImportPath` | Search path for system module imports (`<...>` syntax).  | (empty)     |
| `csl.params`           | Parameter bindings as key-value pairs. Numbers containing `.` are `comptime_float`, otherwise `comptime_int`. | `{}` |
| `csl.rectangle`        | Rectangle size as `width,height` for `@get_rectangle`.   | `100,100`   |
| `csl.fabricDims`       | Fabric dimensions as `width,height`.                     | `100,100`   |
| `csl.fabricOffsets`     | Fabric offsets as `x,y`.                                 | `3,3`       |
| `csl.serverArgs`       | Additional CLI arguments passed to the server.           | `[]`        |
| `csl.trace.server`     | Trace LSP communication (`off`, `messages`, `verbose`).  | `off`       |

### Example Configuration

```json
{
  "csl.arch": "wse2",
  "csl.systemImportPath": "/opt/cerebras/sdk/lib",
  "csl.params": {
    "M": 4,
    "N": 4,
    "width": 8
  }
}
```

## Known Limitations

- **No auto-completion** -- due to current limitations with the ANTLR4-based parser, auto-completion is not yet supported.

## About

This extension is part of a research project at TU Darmstadt (Embedded Systems and Applications Group) that builds MLIR-based compiler infrastructure for Cerebras Wafer-Scale Engines (WSE). Among other things, the project includes a transpiler that extends CSL with additional language features and compiles back to standard CSL. The language server is built on top of the transpiler's frontend, reusing its parser and compile-time evaluation to provide editor features.

## Feedback and Contact

Bug reports and feature requests can be filed on the [GitHub issue tracker](https://github.com/esa-tu-darmstadt/csl-lsp-server/issues).

The underlying compiler infrastructure is not publicly available at this time. If you are interested in the project or in collaborating, feel free to reach out to us by email: noack@esa.tu-darmstadt.de

## Note

If you have the official "Cerebras Software Language (CSL)" extension installed, you can keep it -- both extensions work side by side without conflicts. That extension provides syntax highlighting only; this extension includes syntax highlighting plus full language server features.
