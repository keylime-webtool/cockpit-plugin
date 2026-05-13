import { apiGet } from "./client";
import type { IntegrationService, PerformanceSummary, SystemPerformance } from "../types";

export const performanceApi = {
    getSummary(): Promise<PerformanceSummary> {
        return apiGet<PerformanceSummary>("/performance/summary");
    },

    getVerifierMetrics(): Promise<unknown> {
        return apiGet("/performance/verifiers");
    },

    getDatabaseMetrics(): Promise<unknown> {
        return apiGet("/performance/database");
    },

    getApiResponseTimes(): Promise<unknown> {
        return apiGet("/performance/api-response-times");
    },

    getCapacity(): Promise<unknown> {
        return apiGet("/performance/capacity");
    },

    getIntegrationStatus(): Promise<IntegrationService[]> {
        return apiGet<IntegrationService[]>("/integrations/status");
    },

    getSystemPerformance(): Promise<SystemPerformance> {
        return apiGet<SystemPerformance>("/system/performance");
    },
};
