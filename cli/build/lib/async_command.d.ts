import { Command } from "commander";
export declare function applyAnyAsyncAction<Options = Record<string, any>>(command: Command, resolve: () => Promise<{
    actionAsync: (options: Options) => Promise<unknown>;
}>): void;
//# sourceMappingURL=async_command.d.ts.map