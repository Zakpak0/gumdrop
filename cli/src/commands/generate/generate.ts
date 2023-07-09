import chalk from "chalk";
import fs from "fs";
import path from "path";
import {
  CommandInterface,
  OpenAICommandInterface,
} from "../../lib/command_interface";
import { readConfig } from "../../lib/config";
export async function generate(options: Record<string, any>): Promise<{
  completed: boolean;
  error?: string | undefined;
}> {
  const config = await readConfig();
  let command_interface: CommandInterface;
  const cwd = process.cwd();
  if (config?.commandPath) {
    const abs = path.resolve(cwd, config.commandPath ?? "");
    const ci = require(abs).default;
    command_interface = new ci();
  } else {
    command_interface = new OpenAICommandInterface();
  }
  const file = options?.file;
  const name = options?.name;
  if (file == null || file.length == 0) {
    console.warn(
      `${chalk.red(
        "Failed to doucment"
      )} --file argument is empty \n ${chalk.red("recieved:")} ${file}`
    );
    process.exit(1);
  } else {
    const fileName = path.basename(file);
    const generation = await command_interface.generateDocumentation(
      readFile(file)
    );
    if (generation.completed) {
      if(generation?.response && name){
      fs.writeFileSync(`./${name}.md`, generation.response)
      }
      console.log(
        `${chalk.green("Doucmented!")} ${fileName} \n ${chalk.green(
          "recieved:"
        )}`,
        generation
      );
      return generation;
    } else {
      console.log(
        `${chalk.red("Failed to doucment")} ${fileName} \n ${chalk.red(
          "recieved:"
        )}`,
        generation
      );
      return generation;
    }
  }
}

export function readFile(file: string): string {
  try {
    const cwd = process.cwd();
    const abs = path.resolve(cwd, file);
    const contents = fs.readFileSync(abs, "utf-8");
    return contents;
  } catch (e) {
    console.error(
      `\n ${e} \n ${chalk.red(
        "Failed to doucment"
      )} --file argument was non-existant file path \n ${chalk.red(
        "recieved:"
      )} ${file}`
    );
    process.exit(1);
  }
}
