import { cosmiconfig } from "cosmiconfig";
import GlobalOptions from "./api";
const moduleName = "gumdrop";
const explorer = cosmiconfig(moduleName, {
  searchPlaces: [
    "package.json",
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.js`,
    `.${moduleName}rc.cjs`,
    `.config/${moduleName}rc`,
    `.config/${moduleName}rc.json`,
    `.config/${moduleName}rc.yaml`,
    `.config/${moduleName}rc.yml`,
    `.config/${moduleName}rc.js`,
    `.config/${moduleName}rc.cjs`,
    `${moduleName}.config.js`,
    `${moduleName}.config.cjs`,
    `${moduleName}.json`,
    `${moduleName}.config.json`,
  ],
});

/**
 * Read and parse the config file.
 */
export async function readConfig(): Promise<GumdropServerConfig | undefined> {
  const result = await explorer.search();
  return result?.config;
}

/**
 * The configuration for the Gumdrop CLI.
 */
export interface GumdropServerConfig<V = GlobalOptions> {
  /**
   * The path to the entry point of your server.
   */
  serverPath?: string;
  /**
   * The path to the Server Interface file.
   * The Interface should export a server interface implementation.
   */
  apiPath?: string;
  /**
   * The path of the your project's root directory.
   */
  basePath?: string;
  options: V;
}
