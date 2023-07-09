import type {Command} from 'commander';

const COMMANDS: any[] = [require('./start')];

export function registerCommands(program: Command) {
  COMMANDS.forEach(commandModule => {
    commandModule.default(program);
  });
}
