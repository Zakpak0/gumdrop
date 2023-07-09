import {GumdropServerConfig, readConfig} from '../../lib/config';
import chalk from 'chalk';
export async function start(): Promise<void> {
  const config = await readConfig();
  if (config?.options?.version) {
    const version = config.options.version;
    const selectedVersion: IVersion = await import(`./versions/${version}`);
    const runVersion = selectedVersion.start;
    console.log(`${chalk.green('Starting')} version ${version} implimentation`);
    runVersion(config);
  } else {
    console.log(`${chalk.red('Error')}: No version specified in config!`);
    process.exit(1);
  }
}

type TStart = (config: GumdropServerConfig | undefined) => Promise<void>;
export interface IVersion {
  start: TStart;
}
