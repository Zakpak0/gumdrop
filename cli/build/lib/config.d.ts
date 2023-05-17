/**
 * Read and parse the config file.
 */
export declare function readConfig(): Promise<any>;
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
//# sourceMappingURL=config.d.ts.map