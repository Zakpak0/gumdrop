export type Action = (...args: any[]) => Promise<void>;
export declare function run(programName: string): void;
