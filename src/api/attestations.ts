import { apiGet, apiPost } from "./client";
import type {
    AttestationSummary, AttestationTimelinePoint,
    FailureCategoryCount, AttestationIncident,
} from "../types";

export const attestationsApi = {
    getSummary(range?: string): Promise<AttestationSummary> {
        return apiGet<AttestationSummary>("/attestations/summary", { range });
    },

    getTimeline(range?: string): Promise<AttestationTimelinePoint[]> {
        return apiGet<AttestationTimelinePoint[]>("/attestations/timeline", { range });
    },

    getFailures(range?: string): Promise<FailureCategoryCount[]> {
        return apiGet<FailureCategoryCount[]>("/attestations/failures", { range });
    },

    getIncidents(range?: string): Promise<AttestationIncident[]> {
        return apiGet<AttestationIncident[]>("/attestations/incidents", { range });
    },

    rollbackPolicy(incidentId: string): Promise<void> {
        return apiPost(`/attestations/incidents/${incidentId}/rollback`);
    },
};
