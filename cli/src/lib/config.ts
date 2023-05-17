import { cosmiconfig } from "cosmiconfig";
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
export async function readConfig() {
  const result = await explorer.search();
  return result?.config;
}

/**
 * The configuration for the Gumdrop CLI.
 */
export interface GumConfig {
  /**
   * The path to the command interface file.
   */
  commandPath?: string;
  /**
   * The path of the your project's root directory.
   */
  basePath?: string;
}
