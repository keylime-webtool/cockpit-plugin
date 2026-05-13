import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import cockpit from "cockpit";
import { usePageLocation } from "../usePageLocation";

beforeEach(() => {
    cockpit.__resetMock();
    cockpit.location.path = [];
    cockpit.location.href = "";
});

describe("usePageLocation", () => {
    it("returns the current cockpit location", () => {
        cockpit.location.path = ["agents"];
        cockpit.location.href = "/agents";

        const { result } = renderHook(() => usePageLocation());
        expect(result.current.path).toEqual(["agents"]);
    });

    it("updates when locationchanged event fires", () => {
        const { result } = renderHook(() => usePageLocation());
        expect(result.current.path).toEqual([]);

        act(() => {
            cockpit.location.path = ["performance"];
            cockpit.location.href = "/performance";
            cockpit.__emitEvent("locationchanged");
        });

        expect(result.current.path).toEqual(["performance"]);
    });

    it("cleans up event listener on unmount", () => {
        const { unmount } = renderHook(() => usePageLocation());

        unmount();

        cockpit.location.path = ["should-not-see"];
        cockpit.__emitEvent("locationchanged");
    });
});
