export type AttestationResult = "pass" | "fail";

export type FailureType =
    | "quote_invalid"
    | "policy_violation"
    | "evidence_chain_broken"
    | "boot_violation"
    | "timeout"
    | "pcr_mismatch"
    | "clock_skew"
    | "unknown";

export interface VerificationStage {
    stage: string;
    status: AttestationResult;
    duration_ms: number;
}

export interface Attestation {
    agent_id: string;
    timestamp: string;
    result: AttestationResult;
    failure_type?: FailureType;
    failure_reason?: string;
    latency_ms: number;
    verification_pipeline_stages: VerificationStage[];
}

export interface AttestationSummary {
    total_successful: number;
    total_failed: number;
    total_timed_out: number;
    average_latency_ms: number;
    success_rate: number;
}

export interface AttestationTimelinePoint {
    hour: string;
    successful: number;
    failed: number;
    timed_out: number;
}

export interface FailureCategoryCount {
    type: FailureType;
    count: number;
    percentage: number;
}

export interface AttestationIncident {
    id: string;
    affected_agents: string[];
    failure_type: FailureType;
    root_cause_suggestion: string;
    first_seen: string;
    last_seen: string;
    count: number;
}
