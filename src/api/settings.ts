import { apiGet, apiPut } from "./client";

export const settingsApi = {
    getKeylimeSettings(): Promise<unknown> {
        return apiGet("/settings/keylime");
    },

    modifyKeylimeSettings(settings: Record<string, unknown>): Promise<void> {
        return apiPut("/settings/keylime", settings);
    },

    getCertificateSettings(): Promise<unknown> {
        return apiGet("/settings/certificates");
    },

    modifyCertificateSettings(settings: Record<string, unknown>): Promise<void> {
        return apiPut("/settings/certificates", settings);
    },
};
