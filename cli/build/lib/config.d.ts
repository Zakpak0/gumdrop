/**
 * Read and parse the config file.
 */
export declare function readConfig(): Promise<GumdropCLIConfig | undefined>;
/**
 * The configuration for the Gumdrop CLI.
 */
export interface GumdropCLIConfig {
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