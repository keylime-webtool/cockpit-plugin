import { apiGet } from "./client";
import type { AuditLogEntry, HashChainStatus, PaginatedResponse, AuditSeverity } from "../types";

export const auditApi = {
    list(params?: {
        severity?: AuditSeverity;
        category?: string;
        from_date?: string;
        to_date?: string;
        page?: number;
        per_page?: number;
    }): Promise<PaginatedResponse<AuditLogEntry>> {
        return apiGet<PaginatedResponse<AuditLogEntry>>(
            "/audit-log",
            params as Record<string, string | number | undefined>,
        );
    },

    exportLog(format: "csv" | "json"): Promise<string> {
        return apiGet<string>("/audit-log/export", { format });
    },

    verifyChain(): Promise<HashChainStatus> {
        return apiGet<HashChainStatus>("/audit-log/verify");
    },
};
