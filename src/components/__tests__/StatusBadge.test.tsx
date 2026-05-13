import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

describe("StatusBadge", () => {
    it("renders uppercase label for lowercase status", () => {
        render(<StatusBadge status="pass" />);
        expect(screen.getByText("PASS")).toBeInTheDocument();
    });

    it("renders uppercase label for uppercase status", () => {
        render(<StatusBadge status="FAIL" />);
        expect(screen.getByText("FAIL")).toBeInTheDocument();
    });

    it("replaces underscores with spaces", () => {
        render(<StatusBadge status="under_investigation" />);
        expect(screen.getByText("UNDER INVESTIGATION")).toBeInTheDocument();
    });

    it("uses custom label when provided", () => {
        render(<StatusBadge status="pass" label="Healthy" />);
        expect(screen.getByText("Healthy")).toBeInTheDocument();
    });

    it("renders unknown status with grey fallback", () => {
        const { container } = render(<StatusBadge status="unknown_state" />);
        expect(container.querySelector(".pf-v6-c-label")).toBeInTheDocument();
        expect(screen.getByText("UNKNOWN STATE")).toBeInTheDocument();
    });
});
