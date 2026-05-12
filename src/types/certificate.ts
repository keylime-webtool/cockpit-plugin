export type CertificateType = "ek" | "ak" | "mtls";

export type CertificateStatus = "valid" | "expiring_soon" | "critical" | "expired";

export type ExpiryCategory =
    | "valid"
    | "warning_90d"
    | "warning_30d"
    | "critical_7d"
    | "critical_1d"
    | "expired";

export type ValidationStatus = "valid" | "invalid" | "unknown";

export interface Certificate {
    id: string;
    type: CertificateType;
    subject_dn: string;
    issuer_dn: string;
    serial_number: string;
    not_before: string;
    not_after: string;
    public_key_algorithm: string;
    public_key_size: number;
    signature_algorithm: string;
    san: string[];
    key_usage: string[];
    extended_key_usage: string[];
    status: CertificateStatus;
    expiry_category: ExpiryCategory;
    associated_entity: string;
    validation_status: ValidationStatus;
    chain_valid: boolean | null;
    chain: Certificate[];
    raw_pem?: string;
}

export interface CertificateExpirySummary {
    expired: number;
    expiring_30d: number;
    expiring_90d: number;
    valid: number;
    total: number;
    timeline_90d: CertificateTimelineEntry[];
}

export interface CertificateTimelineEntry {
    date: string;
    count: number;
    expiry_category: ExpiryCategory;
}
