import type { Severity } from "./severity";

export type AuditSeverity = Severity;

export type AuditAction =
    | "create_agent"
    | "read_agent"
    | "update_policy"
    | "delete_cert"
    | "approve_policy"
    | "login"
    | "logout"
    | "bulk_action"
    | "export_data"
    | "config_change";

export type AuditResult = "success" | "denied" | "error";

export interface AuditLogEntry {
    id: string;
    timestamp: string;
    actor: string;
    action: AuditAction;
    resource_type: string;
    resource_id: string;
    result: AuditResult;
    source_ip: string;
    user_agent: string;
    previous_entry_hash: string;
    details: Record<string, unknown>;
    severity: AuditSeverity;
}

export interface HashChainStatus {
    verified: boolean;
    last_verification: string;
    total_entries: number;
    broken_at?: number;
}
