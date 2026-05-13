import { describe, it, expect } from "vitest";
import { buildQueryString } from "../client";

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
