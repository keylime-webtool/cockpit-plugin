import { describe, it, expect, beforeEach } from "vitest";
import cockpit from "cockpit";
import { useVisualizationStore, DATE_FORMATS } from "../visualizationStore";

beforeEach(() => {
    cockpit.__resetMock();
});

describe("visualizationStore", () => {
    describe("default values", () => {
        it("has autoRefresh enabled by default", () => {
            expect(useVisualizationStore.getState().autoRefresh).toBe(true);
        });

        it("has 30s refresh interval by default", () => {
            expect(useVisualizationStore.getState().refreshInterval).toBe(30);
        });

        it("has 24h default time range", () => {
            expect(useVisualizationStore.getState().defaultTimeRange).toBe("24h");
        });

        it("has chart labels enabled by default", () => {
            expect(useVisualizationStore.getState().showChartLabels).toBe(true);
        });

        it("has 25 rows per page by default", () => {
            expect(useVisualizationStore.getState().tablePageSize).toBe(25);
        });

        it("has timezone auto-detect enabled by default", () => {
            expect(useVisualizationStore.getState().timezoneAutoDetect).toBe(true);
        });

        it("has a non-empty timezone", () => {
            expect(useVisualizationStore.getState().timezone).toBeTruthy();
        });
    });

    describe("setters", () => {
        it("setAutoRefresh updates state and persists", () => {
            useVisualizationStore.getState().setAutoRefresh(false);
            expect(useVisualizationStore.getState().autoRefresh).toBe(false);

            const stored = JSON.parse(cockpit.localStorage.getItem("visualization-settings")!);
            expect(stored.autoRefresh).toBe(false);
        });

        it("setRefreshInterval updates state and persists", () => {
            useVisualizationStore.getState().setRefreshInterval(60);
            expect(useVisualizationStore.getState().refreshInterval).toBe(60);

            const stored = JSON.parse(cockpit.localStorage.getItem("visualization-settings")!);
            expect(stored.refreshInterval).toBe(60);
        });

        it("setDefaultTimeRange updates state", () => {
            useVisualizationStore.getState().setDefaultTimeRange("7d");
            expect(useVisualizationStore.getState().defaultTimeRange).toBe("7d");
        });

        it("setShowChartLabels updates state", () => {
            useVisualizationStore.getState().setShowChartLabels(false);
            expect(useVisualizationStore.getState().showChartLabels).toBe(false);
        });

        it("setTablePageSize updates state", () => {
            useVisualizationStore.getState().setTablePageSize(50);
            expect(useVisualizationStore.getState().tablePageSize).toBe(50);
        });

        it("setTimezone updates state", () => {
            useVisualizationStore.getState().setTimezone("Europe/Madrid");
            expect(useVisualizationStore.getState().timezone).toBe("Europe/Madrid");
        });

        it("setDateFormat updates state", () => {
            useVisualizationStore.getState().setDateFormat("YYYY/MM/DD");
            expect(useVisualizationStore.getState().dateFormat).toBe("YYYY/MM/DD");
        });

        it("setTimeFormat updates state", () => {
            useVisualizationStore.getState().setTimeFormat("12h");
            expect(useVisualizationStore.getState().timeFormat).toBe("12h");
        });

        it("setIntegrationsViewMode updates state", () => {
            useVisualizationStore.getState().setIntegrationsViewMode("list");
            expect(useVisualizationStore.getState().integrationsViewMode).toBe("list");
        });
    });

    describe("timezoneAutoDetect", () => {
        it("setting auto-detect to true updates timezone to browser timezone", () => {
            useVisualizationStore.getState().setTimezone("UTC");
            useVisualizationStore.getState().setTimezoneAutoDetect(true);

            const state = useVisualizationStore.getState();
            expect(state.timezoneAutoDetect).toBe(true);
            expect(state.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
        });

        it("setting auto-detect to false keeps current timezone", () => {
            useVisualizationStore.getState().setTimezone("America/New_York");
            useVisualizationStore.getState().setTimezoneAutoDetect(false);

            expect(useVisualizationStore.getState().timezone).toBe("America/New_York");
        });
    });

    describe("DATE_FORMATS constant", () => {
        it("contains six format options", () => {
            expect(DATE_FORMATS).toHaveLength(6);
        });

        it("includes common date format patterns", () => {
            expect(DATE_FORMATS).toContain("YYYY-MM-DD");
            expect(DATE_FORMATS).toContain("DD/MM/YYYY");
            expect(DATE_FORMATS).toContain("MM/DD/YYYY");
        });
    });

    describe("persistence", () => {
        it("saves all settings to localStorage", () => {
            useVisualizationStore.getState().setRefreshInterval(120);

            const raw = cockpit.localStorage.getItem("visualization-settings");
            expect(raw).toBeTruthy();

            const stored = JSON.parse(raw!);
            expect(stored.refreshInterval).toBe(120);
            expect(stored).toHaveProperty("autoRefresh");
            expect(stored).toHaveProperty("showChartLabels");
            expect(stored).toHaveProperty("dateFormat");
            expect(stored).toHaveProperty("timeFormat");
        });
    });
});
