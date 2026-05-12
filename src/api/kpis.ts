import { apiGet } from "./client";
import type { FleetKpis } from "../types";

export const kpisApi = {
    getFleetKpis(): Promise<FleetKpis> {
        return apiGet<FleetKpis>("/kpis");
    },
};
