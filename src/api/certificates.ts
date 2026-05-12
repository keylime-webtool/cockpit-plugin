import { apiGet } from "./client";
import type {
    Certificate, CertificateExpirySummary,
    CertificateTimelineEntry, PaginatedResponse,
    CertificateType, ExpiryCategory,
} from "../types";

export const certificatesApi = {
    list(params?: {
        type?: CertificateType;
        expiry_category?: ExpiryCategory;
    }): Promise<PaginatedResponse<Certificate>> {
        return apiGet<PaginatedResponse<Certificate>>(
            "/certificates",
            params as Record<string, string | number | undefined>,
        );
    },

    get(certId: string): Promise<Certificate> {
        return apiGet<Certificate>(`/certificates/${certId}`);
    },

    getExpirySummary(): Promise<CertificateExpirySummary> {
        return apiGet<CertificateExpirySummary>("/certificates/expiry");
    },

    getTimeline(): Promise<CertificateTimelineEntry[]> {
        return apiGet<CertificateTimelineEntry[]>("/certificates/timeline");
    },

    downloadPem(certId: string): Promise<string> {
        return apiGet<string>(`/certificates/${certId}/download/pem`);
    },

    downloadDer(certId: string): Promise<string> {
        return apiGet<string>(`/certificates/${certId}/download/der`);
    },
};
