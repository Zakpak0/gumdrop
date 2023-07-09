import type { Command } from "commander";

import { applyAnyAsyncAction } from "../../lib/async_command";

export default function (program: Command) {
  applyAnyAsyncAction(
    program
      .command("generate")
      .description(
        "Send documentation to a DocumentationServer for generation to DocumentationClient"
      )
      .alias("gen")
      .option("-f, --file [string]", "Path to file to generate for")
      .option("-n, --name [string]", "Name of the generated MD file"),
    () => import("./generateAsync")
  );
}
