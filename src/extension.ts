import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";

let client: LanguageClient | undefined;
let outputChannel: vscode.OutputChannel;

function getServerPath(context: vscode.ExtensionContext): string {
  const config = vscode.workspace.getConfiguration("csl");
  const configured = config.get<string>("serverPath", "");

  // Explicit user override takes priority.
  if (configured) {
    return configured;
  }

  // Look for the binary bundled with the extension.
  const bundled = path.join(context.extensionPath, "bin", "csl-lsp-server");
  if (fs.existsSync(bundled)) {
    return bundled;
  }

  // Fall back to PATH lookup.
  return "csl-lsp-server";
}

function createClient(context: vscode.ExtensionContext): LanguageClient {
  const config = vscode.workspace.getConfiguration("csl");
  const serverPath = getServerPath(context);
  const serverArgs = config.get<string[]>("serverArgs", []);
  const arch = config.get<string>("arch", "wse2");
  const systemImportPath = config.get<string>("systemImportPath", "");

  const params = config.get<Record<string, number>>("params", {});

  const rectangle = config.get<string>("rectangle", "100,100");
  const fabricDims = config.get<string>("fabricDims", "100,100");
  const fabricOffsets = config.get<string>("fabricOffsets", "3,3");

  const args = [
    "--arch", arch,
    "--rectangle", rectangle,
    "--fabric-dims", fabricDims,
    "--fabric-offsets", fabricOffsets,
    ...serverArgs,
  ];

  const paramsStr = Object.entries(params)
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  if (paramsStr) {
    args.push("--params", paramsStr);
  }
  if (systemImportPath) {
    args.push("--system-import-path", systemImportPath);
  }

  const serverOptions: ServerOptions = {
    command: serverPath,
    args,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "csl" }],
    outputChannel,
  };

  return new LanguageClient(
    "csl",
    "CSL Language Server",
    serverOptions,
    clientOptions
  );
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel("CSL Language Server");
  context.subscriptions.push(outputChannel);

  client = createClient(context);
  client.start();

  context.subscriptions.push(
    vscode.commands.registerCommand("csl.restartServer", async () => {
      if (client) {
        await client.stop();
        client.dispose();
      }
      outputChannel.appendLine("Restarting CSL Language Server...");
      client = createClient(context);
      await client.start();
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("csl")) {
        vscode.commands.executeCommand("csl.restartServer");
      }
    })
  );
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
