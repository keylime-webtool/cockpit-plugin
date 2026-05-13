import { describe, it, expect, beforeEach } from "vitest";
import cockpit from "cockpit";
import { useCockpitAuth } from "../cockpitAuth";

beforeEach(() => {
    cockpit.__resetMock();
    useCockpitAuth.setState({
        userName: "",
        fullName: "",
        groups: [],
        role: "viewer",
        initialized: false,
    });
});

describe("cockpitAuth store", () => {
    describe("default state", () => {
        it("starts with viewer role", () => {
            expect(useCockpitAuth.getState().role).toBe("viewer");
        });

        it("starts uninitialized", () => {
            expect(useCockpitAuth.getState().initialized).toBe(false);
        });

        it("starts with empty user info", () => {
            const state = useCockpitAuth.getState();
            expect(state.userName).toBe("");
            expect(state.fullName).toBe("");
            expect(state.groups).toEqual([]);
        });
    });

    describe("initialize", () => {
        it("fetches user info from cockpit", async () => {
            cockpit.user = () =>
                Promise.resolve({
                    name: "jdoe",
                    full_name: "Jane Doe",
                    id: 1001,
                    gid: 1001,
                    groups: ["keylime-operator"],
                    home: "/home/jdoe",
                    shell: "/bin/bash",
                });

            await useCockpitAuth.getState().initialize();

            const state = useCockpitAuth.getState();
            expect(state.userName).toBe("jdoe");
            expect(state.fullName).toBe("Jane Doe");
            expect(state.initialized).toBe(true);
        });

        it("resolves admin role from keylime-admin group", async () => {
            cockpit.user = () =>
                Promise.resolve({
                    name: "admin",
                    full_name: "Admin",
                    id: 0,
                    gid: 0,
                    groups: ["keylime-admin", "wheel"],
                    home: "/root",
                    shell: "/bin/bash",
                });

            await useCockpitAuth.getState().initialize();
            expect(useCockpitAuth.getState().role).toBe("admin");
        });

        it("resolves operator role from keylime-operator group", async () => {
            cockpit.user = () =>
                Promise.resolve({
                    name: "op",
                    full_name: "Op",
                    id: 1002,
                    gid: 1002,
                    groups: ["keylime-operator"],
                    home: "/home/op",
                    shell: "/bin/bash",
                });

            await useCockpitAuth.getState().initialize();
            expect(useCockpitAuth.getState().role).toBe("operator");
        });

        it("defaults to viewer when no keylime groups", async () => {
            cockpit.user = () =>
                Promise.resolve({
                    name: "viewer",
                    full_name: "Viewer",
                    id: 1003,
                    gid: 1003,
                    groups: ["users"],
                    home: "/home/viewer",
                    shell: "/bin/bash",
                });

            await useCockpitAuth.getState().initialize();
            expect(useCockpitAuth.getState().role).toBe("viewer");
        });
    });

    describe("hasRole", () => {
        it("admin has all roles", () => {
            useCockpitAuth.setState({ role: "admin" });
            const state = useCockpitAuth.getState();
            expect(state.hasRole("viewer")).toBe(true);
            expect(state.hasRole("operator")).toBe(true);
            expect(state.hasRole("admin")).toBe(true);
        });

        it("operator has viewer and operator but not admin", () => {
            useCockpitAuth.setState({ role: "operator" });
            const state = useCockpitAuth.getState();
            expect(state.hasRole("viewer")).toBe(true);
            expect(state.hasRole("operator")).toBe(true);
            expect(state.hasRole("admin")).toBe(false);
        });

        it("viewer only has viewer role", () => {
            useCockpitAuth.setState({ role: "viewer" });
            const state = useCockpitAuth.getState();
            expect(state.hasRole("viewer")).toBe(true);
            expect(state.hasRole("operator")).toBe(false);
            expect(state.hasRole("admin")).toBe(false);
        });
    });

    describe("canWrite", () => {
        it("returns true for operator", () => {
            useCockpitAuth.setState({ role: "operator" });
            expect(useCockpitAuth.getState().canWrite()).toBe(true);
        });

        it("returns true for admin", () => {
            useCockpitAuth.setState({ role: "admin" });
            expect(useCockpitAuth.getState().canWrite()).toBe(true);
        });

        it("returns false for viewer", () => {
            useCockpitAuth.setState({ role: "viewer" });
            expect(useCockpitAuth.getState().canWrite()).toBe(false);
        });
    });

    describe("isAdmin", () => {
        it("returns true only for admin", () => {
            useCockpitAuth.setState({ role: "admin" });
            expect(useCockpitAuth.getState().isAdmin()).toBe(true);
        });

        it("returns false for operator", () => {
            useCockpitAuth.setState({ role: "operator" });
            expect(useCockpitAuth.getState().isAdmin()).toBe(false);
        });

        it("returns false for viewer", () => {
            useCockpitAuth.setState({ role: "viewer" });
            expect(useCockpitAuth.getState().isAdmin()).toBe(false);
        });
    });
});
