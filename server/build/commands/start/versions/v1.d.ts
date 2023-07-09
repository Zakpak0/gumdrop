import { GumdropServerConfig } from "../../../lib/config";
import { server_interface_v1 } from "../../../lib/server_interface";
export declare function start(config: GumdropServerConfig<server_interface_v1.Options> | undefined): Promise<void>;
