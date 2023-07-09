import {Gaxios} from "gaxios";
/**
 * Defines the root interface for all clients that generate documentation
 * requests. All clients should implement this interface.
 */
export interface CommandInterface {
  /**
   * @param file The string representation of the file to generate documentation for.
   * @returns A promise that resolves with a completed field that can be casted
   * to a boolean and an error field that can be casted to a string. If the
   * documentation was not generated successfully, the error field must be
   * populated with an error message. If the documentation was generated
   * successfully, the completed field must be set to true.
   */
  generateDocumentation(
    file: string
  ): Promise<{ completed: boolean; error?: string, response?: string }>;
}

export class OpenAICommandInterface implements CommandInterface {
  constructor() {
    const gaxios = new Gaxios(
      {
        baseURL: "http://192.168.1.16:3000/v1",
      }
    )
    this.gaxios = gaxios
  }
  gaxios: Gaxios
  async generateDocumentation(file: string): Promise<{
    completed: boolean;
    error?: string | undefined;
    response?: string | undefined;
  }> {
    if(typeof file == "string" && file.length > 0){
     const query = await this.gaxios.request({
        url: "/generate",
        method: "POST",
        data:{
          file
        }
      }).then((response)=> {
        if(response?.status != 200){
          if(response?.data?.error){
            return {completed: false, error: response?.data?.error}
          }else{
            return {completed: false, error: "Error generating documentation, unknown error"}
          }
        }else{
          return {completed: true, response: response?.data?.response}
        }
      }).catch((error) => {
        if(error?.response?.data){
          return {completed: false, error: error?.response?.data?.error}
        }
        return {completed: false, error: error?.message}
      })
      return query
    }
    return { completed: false, error: "Not implemented" };
  }
}
