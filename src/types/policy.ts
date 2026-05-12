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
    content: string;
    checksum: string;
    hash_algorithm: HashAlgorithm;
    versions: PolicyVersion[];
    approval_state: ApprovalState;
    drafter: string;
    approver?: string;
    created_date: string;
    updated_date: string;
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
