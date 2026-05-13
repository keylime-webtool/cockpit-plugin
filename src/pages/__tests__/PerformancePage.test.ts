import { describe, it, expect } from "vitest";
import {
    capacityVariant,
    CIRCUIT_BREAKER_LABELS,
    CIRCUIT_BREAKER_VARIANTS,
} from "../PerformancePage";

describe("capacityVariant", () => {
    it("returns danger when utilization exceeds 90%", () => {
        expect(capacityVariant(91)).toBe("danger");
        expect(capacityVariant(100)).toBe("danger");
    });

    it("returns warning when utilization exceeds 70%", () => {
        expect(capacityVariant(71)).toBe("warning");
        expect(capacityVariant(90)).toBe("warning");
    });

    it("returns default when utilization is 70% or below", () => {
        expect(capacityVariant(70)).toBe("default");
        expect(capacityVariant(0)).toBe("default");
        expect(capacityVariant(50)).toBe("default");
    });
});

describe("CIRCUIT_BREAKER_LABELS", () => {
    it("maps closed to Closed", () => {
        expect(CIRCUIT_BREAKER_LABELS["closed"]).toBe("Closed");
    });

    it("maps open to Open", () => {
        expect(CIRCUIT_BREAKER_LABELS["open"]).toBe("Open");
    });

    it("maps half_open to Half-Open", () => {
        expect(CIRCUIT_BREAKER_LABELS["half_open"]).toBe("Half-Open");
    });
});

describe("CIRCUIT_BREAKER_VARIANTS", () => {
    it("maps closed to success", () => {
        expect(CIRCUIT_BREAKER_VARIANTS["closed"]).toBe("success");
    });

    it("maps open to danger", () => {
        expect(CIRCUIT_BREAKER_VARIANTS["open"]).toBe("danger");
    });

    it("maps half_open to warning", () => {
        expect(CIRCUIT_BREAKER_VARIANTS["half_open"]).toBe("warning");
    });
});
