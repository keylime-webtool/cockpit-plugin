import cockpit from "cockpit";
import { create } from "zustand";

export const DATE_FORMATS = [
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "DD-MM-YYYY",
    "MM-DD-YYYY",
] as const;

export type DateFormat = typeof DATE_FORMATS[number];
export type TimeFormat = "24h" | "12h";
export type IntegrationsViewMode = "list" | "topology";

interface VisualizationState {
    autoRefresh: boolean;
    refreshInterval: number;
    defaultTimeRange: string;
    showChartLabels: boolean;
    tablePageSize: number;
    timezone: string;
    timezoneAutoDetect: boolean;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    integrationsViewMode: IntegrationsViewMode;
    setAutoRefresh: (enabled: boolean) => void;
    setRefreshInterval: (seconds: number) => void;
    setDefaultTimeRange: (range: string) => void;
    setShowChartLabels: (show: boolean) => void;
    setTablePageSize: (size: number) => void;
    setTimezone: (tz: string) => void;
    setTimezoneAutoDetect: (auto: boolean) => void;
    setDateFormat: (format: DateFormat) => void;
    setTimeFormat: (format: TimeFormat) => void;
    setIntegrationsViewMode: (mode: IntegrationsViewMode) => void;
}

const STORAGE_KEY = "visualization-settings";

function loadSettings(): Partial<VisualizationState> {
    try {
        const raw = cockpit.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveSettings(state: Partial<VisualizationState>): void {
    cockpit.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        autoRefresh: state.autoRefresh,
        refreshInterval: state.refreshInterval,
        defaultTimeRange: state.defaultTimeRange,
        showChartLabels: state.showChartLabels,
        tablePageSize: state.tablePageSize,
        timezone: state.timezone,
        timezoneAutoDetect: state.timezoneAutoDetect,
        dateFormat: state.dateFormat,
        timeFormat: state.timeFormat,
        integrationsViewMode: state.integrationsViewMode,
    }));
}

function getBrowserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

type SettableKey = Exclude<keyof VisualizationState, `set${string}`>;

function createPersistedSetter<K extends SettableKey>(
    key: K,
    set: (fn: (s: VisualizationState) => Partial<VisualizationState>) => void,
): (value: VisualizationState[K]) => void {
    return (value) =>
        set((s) => {
            const next = { ...s, [key]: value };
            saveSettings(next);
            return { [key]: value } as Partial<VisualizationState>;
        });
}

const saved = loadSettings();
const initialAutoDetect = saved.timezoneAutoDetect ?? true;
const initialTimezone = initialAutoDetect
    ? getBrowserTimezone()
    : (saved.timezone ?? getBrowserTimezone());
const initialDateFormat: DateFormat =
    (DATE_FORMATS as readonly string[]).includes(saved.dateFormat as string)
        ? (saved.dateFormat as DateFormat)
        : "DD-MM-YYYY";
const initialTimeFormat: TimeFormat = saved.timeFormat === "12h" ? "12h" : "24h";
const initialViewMode: IntegrationsViewMode =
    saved.integrationsViewMode === "list" ? "list" : "topology";

export const useVisualizationStore = create<VisualizationState>((set) => ({
    autoRefresh: saved.autoRefresh ?? true,
    refreshInterval: saved.refreshInterval ?? 30,
    defaultTimeRange: saved.defaultTimeRange ?? "24h",
    showChartLabels: saved.showChartLabels ?? true,
    tablePageSize: saved.tablePageSize ?? 25,
    timezone: initialTimezone,
    timezoneAutoDetect: initialAutoDetect,
    dateFormat: initialDateFormat,
    timeFormat: initialTimeFormat,
    integrationsViewMode: initialViewMode,
    setAutoRefresh: createPersistedSetter("autoRefresh", set),
    setRefreshInterval: createPersistedSetter("refreshInterval", set),
    setDefaultTimeRange: createPersistedSetter("defaultTimeRange", set),
    setShowChartLabels: createPersistedSetter("showChartLabels", set),
    setTablePageSize: createPersistedSetter("tablePageSize", set),
    setTimezone: createPersistedSetter("timezone", set),
    setTimezoneAutoDetect: (timezoneAutoDetect) =>
        set((s) => {
            const timezone = timezoneAutoDetect ? getBrowserTimezone() : s.timezone;
            const next = { ...s, timezoneAutoDetect, timezone };
            saveSettings(next);
            return { timezoneAutoDetect, timezone };
        }),
    setDateFormat: createPersistedSetter("dateFormat", set),
    setTimeFormat: createPersistedSetter("timeFormat", set),
    setIntegrationsViewMode: createPersistedSetter("integrationsViewMode", set),
}));
