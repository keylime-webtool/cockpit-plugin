import { apiGet, apiPost } from "./client";
import type {
    Alert, AlertSummary, PaginatedResponse,
    AlertSeverity, AlertState, AlertType,
} from "../types";

export const alertsApi = {
    list(params?: {
        severity?: AlertSeverity;
        state?: AlertState;
        type?: AlertType;
        page?: number;
        per_page?: number;
    }): Promise<PaginatedResponse<Alert>> {
        return apiGet<PaginatedResponse<Alert>>(
            "/alerts",
            params as Record<string, string | number | undefined>,
        );
    },

    getSummary(): Promise<AlertSummary> {
        return apiGet<AlertSummary>("/alerts/summary");
    },

    get(alertId: string): Promise<Alert> {
        return apiGet<Alert>(`/alerts/${alertId}`);
    },

    acknowledge(alertId: string): Promise<void> {
        return apiPost(`/alerts/${alertId}/acknowledge`);
    },

    investigate(alertId: string): Promise<void> {
        return apiPost(`/alerts/${alertId}/investigate`);
    },

    resolve(alertId: string, resolution?: string): Promise<void> {
        return apiPost(`/alerts/${alertId}/resolve`, resolution ? { resolution } : undefined);
    },

    escalate(alertId: string): Promise<void> {
        return apiPost(`/alerts/${alertId}/escalate`);
    },
};
