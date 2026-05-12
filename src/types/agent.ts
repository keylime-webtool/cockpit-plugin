export type AgentState =
    | "registered"
    | "start"
    | "saved"
    | "get_quote"
    | "provide_v"
    | "failed"
    | "retry"
    | "terminated"
    | "invalid_quote"
    | "tenant_failed"
    | "timeout";

export type ApiVersion = "v2_pull" | "v3_push";

export interface AgentHardwareInfo {
    tpm_model: string;
    tpm_version: string;
}

export interface Agent {
    uuid: string;
    ip_address: string;
    hostname: string;
    state: AgentState;
    verifier_id: string;
    registrar_id: string;
    last_attestation: string;
    consecutive_failures: number;
    registration_date: string;
    api_version: ApiVersion;
    hardware_info: AgentHardwareInfo;
}

export interface AgentListParams {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    state?: AgentState;
    search?: string;
    datacenter?: string;
    ip_range?: string;
}

export interface AgentPcrValues {
    hash_alg: string;
    pcrs: Record<string, string>;
}

export interface ImaLogEntry {
    pcr: number;
    template_name: string;
    filename: string;
    filedata_hash: string;
}

export interface BootLogEntry {
    pcr: number;
    event_type: string;
    event_data: string;
    digest: string;
}

export interface ImaLogResponse {
    entries: ImaLogEntry[];
}

export interface BootLogResponse {
    entries: BootLogEntry[];
}
