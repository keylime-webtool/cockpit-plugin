import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import cockpit from "cockpit";
import { KpiCard } from "../KpiCard";

beforeEach(() => {
    cockpit.__resetMock();
});

describe("KpiCard", () => {
    it("renders title and value", () => {
        render(<KpiCard title="Total Agents" value={42} />);
        expect(screen.getByText("Total Agents")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders string value", () => {
        render(<KpiCard title="Status" value="Healthy" />);
        expect(screen.getByText("Healthy")).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
        render(<KpiCard title="Agents" value={10} subtitle="Active" />);
        expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("does not render subtitle when not provided", () => {
        const { container } = render(<KpiCard title="Agents" value={10} />);
        const subtitleDiv = container.querySelector(
            '[style*="color: var(--pf-t--global--color--nonstatus--gray--default)"]',
        );
        expect(subtitleDiv).toBeNull();
    });

    it("applies success variant border", () => {
        const { container } = render(
            <KpiCard title="Status" value="OK" variant="success" />,
        );
        const card = container.firstElementChild as HTMLElement;
        expect(card.style.borderLeft).toContain("solid");
    });

    it("applies warning variant border", () => {
        const { container } = render(
            <KpiCard title="Load" value="75%" variant="warning" />,
        );
        const card = container.firstElementChild as HTMLElement;
        expect(card.style.borderLeft).toContain("solid");
    });

    it("applies danger variant border", () => {
        const { container } = render(
            <KpiCard title="Errors" value={5} variant="danger" />,
        );
        const card = container.firstElementChild as HTMLElement;
        expect(card.style.borderLeft).toContain("solid");
    });

    it("has no border for default variant", () => {
        const { container } = render(
            <KpiCard title="Count" value={0} />,
        );
        const card = container.firstElementChild as HTMLElement;
        expect(card.style.borderLeft).toBe("");
    });

    it("navigates on click when linkTo is set", () => {
        const goSpy = vi.spyOn(cockpit.location, "go");
        render(<KpiCard title="Agents" value={42} linkTo="agents" />);

        const card = screen.getByText("Agents").closest("[class*='card']");
        if (card) fireEvent.click(card);

        expect(goSpy).toHaveBeenCalledWith(["agents"]);
        goSpy.mockRestore();
    });

    it("is not clickable when linkTo is not set", () => {
        const goSpy = vi.spyOn(cockpit.location, "go");
        render(<KpiCard title="Count" value={0} />);

        expect(goSpy).not.toHaveBeenCalled();
        goSpy.mockRestore();
    });
});
