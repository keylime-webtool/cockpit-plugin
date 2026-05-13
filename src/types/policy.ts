export type PolicyKind = "ima" | "measured_boot";

export type ApprovalState =
    | "draft"
    | "pending_approval"
    | "approved"
    | "applied"
    | "rejected";

export type HashAlgorithm = "sha256" | "sha384";

export interface PolicyVersion {
    version: number;
    content: string;
    author: string;
    timestamp: string;
    change_description: string;
}

export interface Policy {
    id: string;
    name: string;
    kind: PolicyKind;
    version: number;
    checksum: string;
    entry_count: number;
    assigned_agents: number;
    created_at: string;
    updated_at: string;
    updated_by: string;
    content: string | null;
}

export type ImpactLevel = "unaffected" | "may_be_affected" | "will_fail";

export interface PolicyImpactResult {
    unaffected: number;
    may_be_affected: number;
    will_fail: number;
    agents: Array<{
        uuid: string;
        hostname: string;
        impact: ImpactLevel;
    }>;
}
