import { apiGet, apiPost } from "./client";
import type {
    Agent, AgentDetail, AgentListParams, AgentPcrValues,
    ImaLogResponse, BootLogResponse, PaginatedResponse,
} from "../types";
import type { Certificate } from "../types/certificate";

export const agentsApi = {
    list(params?: AgentListParams): Promise<PaginatedResponse<Agent>> {
        return apiGet<PaginatedResponse<Agent>>("/agents", params as Record<string, string | number | undefined>);
    },

    get(agentId: string): Promise<AgentDetail> {
        return apiGet<AgentDetail>(`/agents/${agentId}`);
    },

    search(query: string): Promise<Agent[]> {
        return apiGet<Agent[]>("/agents/search", { q: query });
    },

    performAction(agentId: string, action: string): Promise<void> {
        return apiPost(`/agents/${agentId}/actions/${action}`);
    },

    bulkAction(action: string, agentIds: string[]): Promise<void> {
        return apiPost("/agents/bulk", { action, agent_ids: agentIds });
    },

    getTimeline(agentId: string): Promise<unknown> {
        return apiGet(`/agents/${agentId}/timeline`);
    },

    getPcrValues(agentId: string): Promise<AgentPcrValues> {
        return apiGet<AgentPcrValues>(`/agents/${agentId}/pcr`);
    },

    getImaLog(agentId: string): Promise<ImaLogResponse> {
        return apiGet<ImaLogResponse>(`/agents/${agentId}/ima-log`);
    },

    getBootLog(agentId: string): Promise<BootLogResponse> {
        return apiGet<BootLogResponse>(`/agents/${agentId}/boot-log`);
    },

    getCertificates(agentId: string): Promise<Certificate[]> {
        return apiGet<Certificate[]>(`/agents/${agentId}/certificates`);
    },

    getRaw(agentId: string, source?: string): Promise<unknown> {
        return apiGet(`/agents/${agentId}/raw${source ? `/${source}` : ""}`);
    },
};
