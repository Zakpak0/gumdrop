import { Command, program } from "commander";
import { registerCommands } from "./commands";
const packageJson = require("../package.json");

export type Action = (...args: any[]) => void;

// asyncAction is a wrapper for all commands/actions to be executed after commander is done
// parsing the command input
// @ts-expect-error
Command.prototype.asyncAction = function (asyncFn: Action) {
  return this.action(async (...args: any[]) => {
    try {
      await asyncFn(...args);
    } catch (err: any) {
      console.error(err);
      process.exit(1);
    }
  });
};

async function runAsync(programName: string) {
  program.name(programName);
  program.version(packageJson.version);
  registerCommands(program);
  program.on("command:*", (subCommand) => {
    let msg = `"${subCommand}" is not an gumdrop command. See "gumdrop --help" for the full list of commands.`;
    console.warn(msg);
  });
  program.parse(process.argv);
  if (program.args.length === 0) {
    program.help();
  }
}

export function run(programName: string) {
  (async function () {
    await runAsync(programName);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
run("gumdrop");
