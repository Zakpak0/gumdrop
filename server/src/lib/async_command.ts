import { Command } from "commander";
import assert from "node:assert";

export function applyAnyAsyncAction<Options = Record<string, any>>(
  command: Command,
  resolve: () => Promise<{
    actionAsync: (options: Options) => Promise<unknown>;
  }>
) {
  // @ts-expect-error
  command.asyncAction(async (options: Options) => {
    assert(typeof options !== "string", "Unexpected string passed to command");
    const mod = await resolve();
    return mod.actionAsync(options);
  });
}
