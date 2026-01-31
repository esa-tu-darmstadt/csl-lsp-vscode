# CSL Extension Development

Internal documentation for building, packaging, and developing the CSL VS Code extension.

## Prerequisites

- Node.js (v18+)
- npm
- A built `csl-lsp-server` binary (see the main project's build instructions)

## Development Setup

```bash
cd editors/vscode/csl
npm install
npm run compile
```

To launch an Extension Development Host, press **F5** from within VS Code with this directory open. Alternatively, run **Extensions: Install from Location...** from the command palette and select the `editors/vscode/csl` directory.

During development, set `csl.serverPath` in your workspace settings to point at your local build:

```json
{
  "csl.serverPath": "/path/to/build/bin/csl-lsp-server"
}
```

Use `npm run watch` to recompile TypeScript on every save.

## Packaging

The extension ships a platform-specific `.vsix` that bundles the `csl-lsp-server` binary. Each target platform needs its own package.

### Using CMake (recommended)

From the build directory:

```bash
ninja csl-lsp-vscode
```

This builds the server, copies it into the extension, runs npm install/compile, and produces the `.vsix`. The target is only available when the build is configured with `BUILD_SHARED_LIBS=OFF` and `CMAKE_BUILD_TYPE=Release`. It also requires `npm` on PATH. The platform target is detected automatically from the CMake host.

### Manual Steps

1. Build `csl-lsp-server` for the target platform:

   ```bash
   ninja csl-lsp-server
   ```

2. Copy the binary into the extension:

   ```bash
   mkdir -p editors/vscode/csl/bin
   cp build/bin/csl-lsp-server editors/vscode/csl/bin/
   ```

3. Compile and package:

   ```bash
   cd editors/vscode/csl
   npm install
   npm run compile
   npx vsce package --target linux-x64
   ```

   This produces `csl-lsp-linux-x64-<version>.vsix`.

### Supported Targets

| Target           | Description          |
|------------------|----------------------|
| `linux-x64`      | Linux x86_64         |
| `linux-arm64`    | Linux AArch64        |
| `darwin-x64`     | macOS Intel          |
| `darwin-arm64`   | macOS Apple Silicon  |

### How Binary Resolution Works

When the extension activates, it resolves the LSP server in this order:

1. **User override** -- if `csl.serverPath` is set, use that path.
2. **Bundled binary** -- look for `bin/csl-lsp-server` inside the extension directory.
3. **PATH lookup** -- fall back to `csl-lsp-server` on the system PATH.

## Project Structure

```
editors/vscode/csl/
  bin/                    # Bundled binary (not checked in, added before packaging)
  out/                    # Compiled JS output
  src/
    extension.ts          # Extension entry point
  syntaxes/
    csl.tmLanguage.json   # TextMate grammar for syntax highlighting
  language-configuration.json
  package.json
  tsconfig.json
  .vscodeignore           # Files excluded from the .vsix package
  README.md               # User-facing documentation (shown in VS Code)
  DEVELOPMENT.md          # This file (excluded from .vsix)
```
