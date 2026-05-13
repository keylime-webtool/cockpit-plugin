import { describe, it, expect, beforeEach } from "vitest";
import cockpit from "cockpit";
import { buildQueryString, apiGet, apiPost, apiPut, apiDelete, closeClient } from "../client";

beforeEach(() => {
    cockpit.__resetMock();
    closeClient();
});

describe("buildQueryString", () => {
    it("returns empty string for undefined params", () => {
        expect(buildQueryString()).toBe("");
    });

    it("returns empty string for empty object", () => {
        expect(buildQueryString({})).toBe("");
    });

    it("filters out undefined values", () => {
        expect(buildQueryString({ a: "1", b: undefined, c: "3" })).toBe("?a=1&c=3");
    });

    it("encodes special characters", () => {
        expect(buildQueryString({ q: "hello world" })).toBe("?q=hello%20world");
    });

    it("handles numeric values", () => {
        expect(buildQueryString({ page: 2, per_page: 50 })).toBe("?page=2&per_page=50");
    });

    it("builds query with single param", () => {
        expect(buildQueryString({ search: "test" })).toBe("?search=test");
    });

    it("returns empty string when all values are undefined", () => {
        expect(buildQueryString({ a: undefined, b: undefined })).toBe("");
    });
});

describe("apiGet", () => {
    it("unwraps successful response envelope", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: { id: 1, name: "agent-1" },
            timestamp: "2026-01-01T00:00:00Z",
            request_id: "r1",
        });
        cockpit.__setMockResponse(envelope);

        const result = await apiGet<{ id: number; name: string }>("/agents/1");
        expect(result).toEqual({ id: 1, name: "agent-1" });
    });

    it("prepends /api to path", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: null,
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiGet("/agents");
        expect(cockpit.__getLastGetPath()).toBe("/api/agents");
    });

    it("appends query string from params", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: [],
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiGet("/agents", { page: 1, size: 10 });
        expect(cockpit.__getLastGetPath()).toBe("/api/agents?page=1&size=10");
    });

    it("throws on unsuccessful response", async () => {
        const envelope = JSON.stringify({
            success: false,
            error: "Not found",
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await expect(apiGet("/agents/missing")).rejects.toThrow("Not found");
    });

    it("throws generic error when error field is missing", async () => {
        const envelope = JSON.stringify({
            success: false,
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await expect(apiGet("/fail")).rejects.toThrow("Unknown API error");
    });

    it("throws on malformed JSON", async () => {
        cockpit.__setMockResponse("not json");

        await expect(apiGet("/bad")).rejects.toThrow();
    });
});

describe("apiPost", () => {
    it("unwraps successful response", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: { created: true },
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        const result = await apiPost<{ created: boolean }>("/agents", { name: "new" });
        expect(result).toEqual({ created: true });
    });

    it("sends JSON body", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: null,
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiPost("/agents", { name: "test" });
        expect(cockpit.__getLastPostBody()).toBe('{"name":"test"}');
    });

    it("sends undefined body when no body provided", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: null,
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiPost("/action");
        expect(cockpit.__getLastPostBody()).toBeUndefined();
    });
});

describe("apiPut", () => {
    it("uses PUT method via request()", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: { updated: true },
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiPut("/agents/1", { name: "renamed" });
        const opts = cockpit.__getLastRequestOptions();
        expect(opts.method).toBe("PUT");
        expect(opts.path).toBe("/api/agents/1");
        expect(opts.body).toBe('{"name":"renamed"}');
    });

    it("sends undefined body when no body provided", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: null,
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiPut("/agents/1");
        const opts = cockpit.__getLastRequestOptions();
        expect(opts.body).toBeUndefined();
    });
});

describe("apiDelete", () => {
    it("uses DELETE method via request()", async () => {
        cockpit.__setMockResponse("{}");

        await apiDelete("/agents/1");
        const opts = cockpit.__getLastRequestOptions();
        expect(opts.method).toBe("DELETE");
        expect(opts.path).toBe("/api/agents/1");
    });
});

describe("closeClient", () => {
    it("can be called multiple times without error", () => {
        closeClient();
        closeClient();
    });

    it("resets the singleton so next call creates a new client", async () => {
        const envelope = JSON.stringify({
            success: true,
            data: "first",
            timestamp: "",
            request_id: "",
        });
        cockpit.__setMockResponse(envelope);

        await apiGet("/test");
        closeClient();

        cockpit.__setMockResponse(JSON.stringify({
            success: true,
            data: "second",
            timestamp: "",
            request_id: "",
        }));

        const result = await apiGet<string>("/test");
        expect(result).toBe("second");
    });
});
