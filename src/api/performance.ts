import { apiGet } from "./client";
import type { IntegrationService, PerformanceSummary } from "../types";

export const performanceApi = {
    getSummary(): Promise<PerformanceSummary> {
        return apiGet<PerformanceSummary>("/performance/summary");
    },

    getRegistrarMetrics(): Promise<PerformanceSummary> {
        return apiGet<PerformanceSummary>("/performance/registrar");
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
};
