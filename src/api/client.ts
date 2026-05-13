import cockpit from "cockpit";
import type { ApiResponse } from "../types/api";

const BACKEND_ADDRESS = "127.0.0.1";
const BACKEND_PORT = 8080;

let httpClient: cockpit.HttpInstance<string> | null = null;

function getClient(): cockpit.HttpInstance<string> {
    if (!httpClient) {
        httpClient = cockpit.http({
            port: BACKEND_PORT,
            address: BACKEND_ADDRESS,
            headers: { "Content-Type": "application/json" },
        });
    }
    return httpClient;
}

export function buildQueryString(params?: Record<string, string | number | undefined>): string {
    if (!params) return "";
    const entries = Object.entries(params)
        .filter((pair): pair is [string, string | number] => pair[1] !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    return entries.length > 0 ? `?${entries.join("&")}` : "";
}

async function unwrapResponse<T>(responsePromise: Promise<string>): Promise<T> {
    const raw = await responsePromise;
    const envelope: ApiResponse<T> = JSON.parse(raw);
    if (!envelope.success) {
        throw new Error(envelope.error ?? "Unknown API error");
    }
    return envelope.data as T;
}

export async function apiGet<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
): Promise<T> {
    const url = `/api${path}${buildQueryString(params)}`;
    return unwrapResponse<T>(getClient().get(url));
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
    const url = `/api${path}`;
    const jsonBody = body !== undefined ? JSON.stringify(body) : undefined;
    return unwrapResponse<T>(getClient().post(url, jsonBody));
}

export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
    const url = `/api${path}`;
    return unwrapResponse<T>(
        getClient().request({
            path: url,
            method: "PUT",
            body: body !== undefined ? JSON.stringify(body) : undefined,
            headers: { "Content-Type": "application/json" },
        })
    );
}

export async function apiDelete(path: string): Promise<void> {
    const url = `/api${path}`;
    await getClient().request({
        path: url,
        method: "DELETE",
    });
}

export function closeClient(): void {
    if (httpClient) {
        httpClient.close();
        httpClient = null;
    }
}
