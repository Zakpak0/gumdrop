import path from "path";
import { GumdropServerConfig } from "../../../lib/config";
import {
  InkdropDocumenterV1,
  OpenaiGeneratorV1,
  OpenaiRequestHandlerV1,
  OpenaiToInkdropInterfaceV1,
  server_interface_v1,
} from "../../../lib/server_interface";
import chalk from "chalk";
export async function start(
  config: GumdropServerConfig<server_interface_v1.Options> | undefined
): Promise<void> {
  let server_interface: server_interface_v1.ServerInterface;
  const cwd = process.cwd();

  if (config?.serverPath) {
    console.log(
      `${chalk.green("Starting")} user's server from ${config.serverPath}`
    );
    const abs = path.resolve(cwd, config.serverPath ?? "");
    const si = require(abs).default;
    const options = config?.options;
    switch (true) {
      // @ts-expect-error
      case options?.documenter: {
        console.log(
          `${chalk.yellow("Using")} ${chalk.green(
            "InkdropDocumenterV1"
          )} to store generated documentation.`
        );
        si.documenter = new InkdropDocumenterV1();
      }
      // @ts-expect-error
      case options?.generator: {
        console.log(
          `${chalk.yellow("Using")} ${chalk.green(
            "OpenaiGeneratorV1"
          )} to generate documentation.`
        );
        si.generator = new OpenaiGeneratorV1();
      }
      case options?.handler: {
        console.log(
          `${chalk.yellow("Using")} ${chalk.green(
            "OpenaiRequestHandlerV1"
          )} as the server`
        );
        si.handler = new OpenaiRequestHandlerV1();
      }
    }
    server_interface = new si();
  } else {
    // @ts-expect-error
    server_interface = new OpenaiToInkdropInterfaceV1(config ? config : {} as any);
  }
  console.log("Starting your server...");
  server_interface.handler.start(server_interface);
}
