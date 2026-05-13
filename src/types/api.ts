export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
    request_id: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
}

export type UserRole = "viewer" | "operator" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export type ServiceStatus = "up" | "down" | "high_load" | "timeout" | "not_configured";

export interface IntegrationService {
    name: string;
    endpoint: string;
    status: ServiceStatus;
    uptime?: string;
    latency_ms?: number;
}

export interface PerformanceSummary {
    verifier_reachable: boolean;
    verifier_latency_ms: number | null;
    circuit_breaker_state: "closed" | "open" | "half_open";
    agent_count: number;
    estimated_attestation_rate: number | null;
    capacity_utilization_pct: number | null;
    database_status: string;
    registrar_reachable?: boolean;
    registrar_latency_ms?: number | null;
    registered_agent_count?: number;
}

export interface FleetKpis {
    total_active_agents: number;
    failed_agents: number;
    attestation_success_rate: number;
    average_attestation_latency_ms: number;
    certificate_expiry_warnings: number;
    active_ima_policies: number;
    revocation_events_24h: number;
    registration_count: number;
}

export interface TimeRange {
    label: string;
    value: string;
    hours: number;
}

export const TIME_RANGES: TimeRange[] = [
    { label: "1h", value: "1h", hours: 1 },
    { label: "6h", value: "6h", hours: 6 },
    { label: "24h", value: "24h", hours: 24 },
    { label: "7d", value: "7d", hours: 168 },
    { label: "30d", value: "30d", hours: 720 },
];
