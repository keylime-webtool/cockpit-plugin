import cockpit from "cockpit";
import { create } from "zustand";
import type { UserRole } from "../types";

interface CockpitAuthState {
    userName: string;
    fullName: string;
    groups: string[];
    role: UserRole;
    initialized: boolean;
    initialize(): Promise<void>;
    hasRole(required: UserRole): boolean;
    canWrite(): boolean;
    isAdmin(): boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
    viewer: 0,
    operator: 1,
    admin: 2,
};

function resolveRole(groups: string[]): UserRole {
    if (groups.includes("keylime-admin")) return "admin";
    if (groups.includes("keylime-operator")) return "operator";
    return "viewer";
}

export const useCockpitAuth = create<CockpitAuthState>((set, get) => ({
    userName: "",
    fullName: "",
    groups: [],
    role: "viewer",
    initialized: false,

    async initialize() {
        const userInfo = await cockpit.user();
        const role = resolveRole(userInfo.groups);
        set({
            userName: userInfo.name,
            fullName: userInfo.full_name,
            groups: userInfo.groups,
            role,
            initialized: true,
        });
    },

    hasRole(required: UserRole): boolean {
        return ROLE_HIERARCHY[get().role] >= ROLE_HIERARCHY[required];
    },

    canWrite(): boolean {
        return get().hasRole("operator");
    },

    isAdmin(): boolean {
        return get().role === "admin";
    },
}));
