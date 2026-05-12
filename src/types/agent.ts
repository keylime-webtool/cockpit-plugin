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
    | "timeout"
    | "PASS"
    | "FAIL"
    | "TIMEOUT";

export interface Agent {
    id: string;
    ip: string;
    port: number;
    state: AgentState;
    attestation_mode: string;
    last_attestation: string;
    failure_count: number;
    assigned_policy: string | null;
    mb_policy: string | null;
}

export interface AgentDetail extends Agent {
    aik_tpm: string;
    ek_tpm: string;
    tpm_policy: string;
    regcount: number;
    accept_tpm_encryption_algs: string[];
    accept_tpm_hash_algs: string[];
    accept_tpm_signing_algs: string[];
    ima_pcrs: string[];
    ima_policy: string | null;
    certificates: AgentCertificate[];
}

export interface AgentCertificate {
    type: string;
    status: string;
    expiry_category: string;
    not_after: string;
    days_until_expiry: number;
    chain_valid: boolean | null;
    validation_status: string;
}

export interface AgentListParams {
    page?: number;
    per_page?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    state?: AgentState;
    search?: string;
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
