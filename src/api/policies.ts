import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import type {
    Policy, PolicyVersion, PolicyImpactResult, PaginatedResponse,
} from "../types";

export const policiesApi = {
    list(search?: string): Promise<PaginatedResponse<Policy>> {
        return apiGet<PaginatedResponse<Policy>>("/policies", { search });
    },

    get(policyId: string): Promise<Policy> {
        return apiGet<Policy>(`/policies/${policyId}`);
    },

    create(policy: Partial<Policy>): Promise<Policy> {
        return apiPost<Policy>("/policies", policy);
    },

    modify(policyId: string, policy: Partial<Policy>): Promise<Policy> {
        return apiPut<Policy>(`/policies/${policyId}`, policy);
    },

    remove(policyId: string): Promise<void> {
        return apiDelete(`/policies/${policyId}`);
    },

    getVersions(policyId: string): Promise<PolicyVersion[]> {
        return apiGet<PolicyVersion[]>(`/policies/${policyId}/versions`);
    },

    getDiff(policyId: string, from: number, to: number): Promise<string> {
        return apiGet<string>(`/policies/${policyId}/diff`, { from, to });
    },

    rollback(policyId: string, version: number): Promise<void> {
        return apiPost(`/policies/${policyId}/rollback/${version}`);
    },

    analyzeImpact(policyId: string): Promise<PolicyImpactResult> {
        return apiPost<PolicyImpactResult>(`/policies/${policyId}/impact`);
    },

    approve(policyId: string): Promise<void> {
        return apiPost(`/policies/changes/${policyId}/approve`);
    },

    getAssignmentMatrix(): Promise<unknown> {
        return apiGet("/policies/assignment-matrix");
    },
};
