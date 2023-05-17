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
  ): Promise<{ completed: boolean; error?: string }>;
}

export class OpenAICommandInterface implements CommandInterface {
  async generateDocumentation(file: string): Promise<{
    completed: boolean;
    error?: string | undefined;
  }> {
    return { completed: false, error: "Not implemented" };
  }
}
