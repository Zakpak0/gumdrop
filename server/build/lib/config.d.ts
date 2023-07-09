import GlobalOptions from "./api";
/**
 * Read and parse the config file.
 */
export declare function readConfig(): Promise<GumdropServerConfig | undefined>;
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
