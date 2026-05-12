import type { Severity } from "./severity";

export type AlertSeverity = Severity;

export type AlertState =
    | "new"
    | "acknowledged"
    | "under_investigation"
    | "resolved"
    | "dismissed";

export type AlertType =
    | "attestation_failure"
    | "cert_expiry"
    | "policy_violation"
    | "pcr_change"
    | "service_down"
    | "rate_limit"
    | "clock_skew";

export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    description: string;
    affected_agents: string[];
    state: AlertState;
    created_timestamp: string;
    acknowledged_timestamp?: string;
    assigned_to?: string;
    investigation_notes?: string;
    root_cause?: string;
    resolution?: string;
    auto_resolved: boolean;
    escalation_count: number;
    sla_window?: string;
    source: string;
    external_ticket_id?: string;
}

export interface AlertSummary {
    critical: number;
    warnings: number;
    info: number;
    active_alerts: number;
    active_critical: number;
}
