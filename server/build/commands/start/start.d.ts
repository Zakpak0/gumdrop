import { GumdropServerConfig } from '../../lib/config';
export declare function start(): Promise<void>;
type TStart = (config: GumdropServerConfig | undefined) => Promise<void>;
export interface IVersion {
    start: TStart;
}
export {};
