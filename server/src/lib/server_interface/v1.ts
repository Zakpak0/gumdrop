import express, { Application } from "express";
import openai, { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai"
import chalk from "chalk";
import GlobalOptions from "../api";
import { GumdropServerConfig } from "../config";

export namespace server_interface_v1 {
  export interface Options extends GlobalOptions {
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
  export type AIRequest<T = Record<string, unknown>> = T;
  /**
   * An object formatted with the options and data required to store the generated documentation.
   * This Response object will be passed to your Documenter.document function
   */
  export type AIReponse<T = Record<string, unknown>> = T;
  /** Defines the interface for interactions between the server and the chose AI documentation generation tool
   * All AI documentation generation tools must implement this interface
   */
  export interface AIGenerator<
    Request = AIRequest<Record<string, unknown>>,
    Response = AIReponse<Record<string, unknown>>,
    I = ServerInterface | any
  > {
    /**
     * @param file The string representation of the file to generate documentation for.
     * @returns A promise that resolves with a completed field that can be casted
     * to a boolean and an error field that can be casted to a string and a response field that will be
     * passed to your @type {server_interface_v1.AIReponse} implementation. If the
     * documentation was not generated successfully, the error field must be
     * populated with an error message. If the documentation was generated
     * successfully, the completed field must be set to true.
     */
    generate(self: I,
      request: Request
    ): Promise<{ completed: boolean; error?: string; response: Response }>;
  }
  /** Defines the interface for interactions between the server and requests froom
   * the gumdrop CLI
   */
  export interface RequestHandler<
    R = AIRequest<Record<string, unknown>>,
    I = ServerInterface | any
  > {
    /**
     * Defines the method that should be called when the server receives a request
     * @param data The data required to format the properties of the Request object
     * @returns @type {server_interface_v1.AIRequest} A Request object that will be passed to your @type {server_interface_v1.AIGenerator} implementation
     */
    format(self: I,...data: any): R;
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
  export interface Documenter<R = AIReponse<Record<string, unknown>>,  I = ServerInterface | any> {
    document(self: I, context: R): Promise<{
      completed: boolean;
      error?: string | undefined;
      response?: any
    }>;
  }
  /**
   * Defines the root interface for all servers that handle documentation requests.
   * All servers should implement this interface.
   */
  export interface ServerInterface<
    Request = AIRequest<Record<string, unknown>>,
    Response = AIReponse<Record<string, unknown>>
  > {
    handler: RequestHandler<Request>;
    generator: AIGenerator<Response>;
    documenter: Documenter<Response>;
  }
}

export interface OpenaiInterface{
  config: GumdropServerConfig;
  handler: OpenaiToInkdropInterfaceV1["handler"];
  generator: OpenaiToInkdropInterfaceV1["generator"];
  documenter: OpenaiToInkdropInterfaceV1["documenter"];
}
export class OpenaiToInkdropInterfaceV1
  implements server_interface_v1.ServerInterface
{
  constructor(config: GumdropServerConfig) {
    this.config = config;
  }
  config: GumdropServerConfig;
  handler = new OpenaiRequestHandlerV1();
  // @ts-expect-error
  generator = new OpenaiGeneratorV1();
  documenter = new InkdropDocumenterV1();
}

export class OpenaiRequestHandlerV1
  implements server_interface_v1.RequestHandler
{
  format(self: OpenaiInterface, file:string): server_interface_v1.AIRequest {
    // @ts-expect-error
    const request: Record<keyof CreateChatCompletionRequest, CreateChatCompletionRequest[keyof CreateChatCompletionRequest]> = {
      messages: [
        {
          role: "system",
          content: `You a professional technical document write.
          This chatroom is your text editor.
          You are not mean to converse here, unless in the context of storytelling.
          The input you will be given are files written by software developers.
          They need you to write human friendly documentation that will aid them in their day to day work.
          Document their work in a manner that could be understood by other developers. 
          The markdown generated should look modern and stylistic.
          Readers should envy your choice of coloring, font and structuring. `
        },
        {
          role: "user",
          content: file
        }
      ],
      model: "gpt-3.5-turbo-0301",
      temperature: 0,
      top_p: 1,
      n: undefined,
      stream: undefined,
      stop: undefined,
      max_tokens: undefined,
      presence_penalty: 0,
      frequency_penalty: 2,
      logit_bias: undefined,
      user: undefined
    } as unknown as CreateChatCompletionRequest;
    return request;
  }
  start(self: OpenaiInterface): void {
    const app: Application = express();
    const port = 3000;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.get('/', (request, response) => {
      response.send('Hello World!')
    })
    app.post('/v1/generate', async (request, response) => {
      if(!request.body) {
        response.status(400)
        response.send({
          completed: false,
          error: "Request body was empty"
        })
      }else{
        try{
          if(request?.body?.file){
            const { file } = request.body
            const openai_request = self.handler.format(self, file)
            // @ts-expect-error
            const document_generation = await self.generator.generate(self, openai_request)
            const record_document = await self.documenter.document(self, document_generation?.response)
            response.status(200)
            response.send(record_document)
          }else{
            response.status(400)
            response.send({
              completed: false,
              error: "Request body was missing file field"
            })
          }
        }catch (error: any) {
        response.status(500)
        response.send({
          completed: false,
          error: error.message
        })
      }
    }
      })
    app.listen(port, () => {
      console.log(`${chalk.green("OpenaiToInkdropInterfaceV1")} is listening on port ${port}`)
    })
  }
}

export class InkdropDocumenterV1 implements server_interface_v1.Documenter {
  async document(self: OpenaiInterface, document: any): Promise<{ completed: boolean; error?: string | undefined, response?: any }> {
    return {
      completed: true,
      response: document
    }
  }
}

export class OpenaiGeneratorV1 implements server_interface_v1.AIGenerator {
  // @ts-expect-error
 async generate(self: OpenaiInterface, openai_request: CreateChatCompletionRequest): Promise<{ completed: boolean; error?: string; response: any }> {
 const configuration = new Configuration({apiKey: self?.config?.options?.key})
 const openai = new OpenAIApi(configuration)
  const response = await openai.createChatCompletion(openai_request)
  if(response?.data?.choices?.length > 0){
    return {
      completed: true,
      response: response.data.choices[0]?.message?.content
    }
  }else{
    return {
      completed: false,
      error: "No response was returned from the OpenAI API",
      response: response.data
   }
  }
 }
}