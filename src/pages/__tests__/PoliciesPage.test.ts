import { describe, it, expect } from "vitest";
import { formatKind } from "../PoliciesPage";

describe("formatKind", () => {
    it("formats ima as IMA", () => {
        expect(formatKind("ima")).toBe("IMA");
    });

    it("formats measured_boot as Measured Boot", () => {
        expect(formatKind("measured_boot")).toBe("Measured Boot");
    });

    it("passes through unknown kinds unchanged", () => {
        expect(formatKind("custom_policy")).toBe("custom_policy");
    });
});
