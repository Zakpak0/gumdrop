import { CreateChatCompletionRequest } from "openai";
import GlobalOptions from "../api";
import { GumdropServerConfig } from "../config";
export declare namespace server_interface_v1 {
    interface Options extends GlobalOptions {
        version?: "v1";
        handler: boolean;
        generator: boolean;
        documenter: boolean;
    }
    /**
     * An object formatted with the options and data required to generate documentation
     * by your chosen AI documentation generation tool.
     * This Request object will be passed to your AIGenerator.generate function
     */
    type AIRequest<T = Record<string, unknown>> = T;
    /**
     * An object formatted with the options and data required to store the generated documentation.
     * This Response object will be passed to your Documenter.document function
     */
    type AIReponse<T = Record<string, unknown>> = T;
    /** Defines the interface for interactions between the server and the chose AI documentation generation tool
     * All AI documentation generation tools must implement this interface
     */
    interface AIGenerator<Request = AIRequest<Record<string, unknown>>, Response = AIReponse<Record<string, unknown>>, I = ServerInterface | any> {
        /**
         * @param file The string representation of the file to generate documentation for.
         * @returns A promise that resolves with a completed field that can be casted
         * to a boolean and an error field that can be casted to a string and a response field that will be
         * passed to your @type {server_interface_v1.AIReponse} implementation. If the
         * documentation was not generated successfully, the error field must be
         * populated with an error message. If the documentation was generated
         * successfully, the completed field must be set to true.
         */
        generate(self: I, request: Request): Promise<{
            completed: boolean;
            error?: string;
            response: Response;
        }>;
    }
    /** Defines the interface for interactions between the server and requests froom
     * the gumdrop CLI
     */
    interface RequestHandler<R = AIRequest<Record<string, unknown>>, I = ServerInterface | any> {
        /**
         * Defines the method that should be called when the server receives a request
         * @param data The data required to format the properties of the Request object
         * @returns @type {server_interface_v1.AIRequest} A Request object that will be passed to your @type {server_interface_v1.AIGenerator} implementation
         */
        format(self: I, ...data: any): R;
        /**
         * Defines the start method for your server. This method will be called when the server is started.
         * @param self The ServerInterface instance that the RequestHandler will be attached to
         */
        start(self: I): void;
    }
    /** Defines the interface for interactions between the server and the chosen Documentation tool or the Data store
     *  your gumdrop client will be pulling data from.
     *  All documentation tool interfaces must implement this interface
     */
    interface Documenter<R = AIReponse<Record<string, unknown>>, I = ServerInterface | any> {
        document(self: I, context: R): Promise<{
            completed: boolean;
            error?: string | undefined;
            response?: any;
        }>;
    }
    /**
     * Defines the root interface for all servers that handle documentation requests.
     * All servers should implement this interface.
     */
    interface ServerInterface<Request = AIRequest<Record<string, unknown>>, Response = AIReponse<Record<string, unknown>>> {
        handler: RequestHandler<Request>;
        generator: AIGenerator<Response>;
        documenter: Documenter<Response>;
    }
}
export interface OpenaiInterface {
    config: GumdropServerConfig;
    handler: OpenaiToInkdropInterfaceV1["handler"];
    generator: OpenaiToInkdropInterfaceV1["generator"];
    documenter: OpenaiToInkdropInterfaceV1["documenter"];
}
export declare class OpenaiToInkdropInterfaceV1 implements server_interface_v1.ServerInterface {
    constructor(config: GumdropServerConfig);
    config: GumdropServerConfig;
    handler: OpenaiRequestHandlerV1;
    generator: OpenaiGeneratorV1;
    documenter: InkdropDocumenterV1;
}
export declare class OpenaiRequestHandlerV1 implements server_interface_v1.RequestHandler {
    format(self: OpenaiInterface, file: string): server_interface_v1.AIRequest;
    start(self: OpenaiInterface): void;
}
export declare class InkdropDocumenterV1 implements server_interface_v1.Documenter {
    document(self: OpenaiInterface, document: any): Promise<{
        completed: boolean;
        error?: string | undefined;
        response?: any;
    }>;
}
export declare class OpenaiGeneratorV1 implements server_interface_v1.AIGenerator {
    generate(self: OpenaiInterface, openai_request: CreateChatCompletionRequest): Promise<{
        completed: boolean;
        error?: string;
        response: any;
    }>;
}
