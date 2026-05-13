import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { alertsApi } from "../api/alerts";
import type { Alert } from "../types";

type Dimension = "severity" | "type" | "state";

const SEVERITY_COLORS: Record<string, string> = {
    critical: "#ea4335",
    warning: "#f9ab00",
    info: "#1a73e8",
};

const STATE_COLORS: Record<string, string> = {
    new: "#ea4335",
    acknowledged: "#f9ab00",
    under_investigation: "#4285f4",
    resolved: "#34a853",
    dismissed: "#9e9e9e",
};

const TYPE_COLORS: Record<string, string> = {
    attestation_failure: "#ea4335",
    cert_expiry: "#f9ab00",
    policy_violation: "#e8710a",
    pcr_change: "#9334e6",
    service_down: "#d93025",
    rate_limit: "#4285f4",
    clock_skew: "#00897b",
};

const COLOR_MAPS: Record<Dimension, Record<string, string>> = {
    severity: SEVERITY_COLORS,
    type: TYPE_COLORS,
    state: STATE_COLORS,
};

const FALLBACK_COLOR = "#bdbdbd";

const RADIUS = 80;
const INNER_RADIUS = 40;
const CENTER = 120;
const SVG_SIZE = 240;

interface SliceData {
    name: string;
    value: number;
    color: string;
    startAngle: number;
    endAngle: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number): string {
    const sweep = endAngle - startAngle;
    if (sweep >= 359.99) {
        const halfStart = startAngle;
        const halfEnd = startAngle + 180;
        return (
            describeArc(cx, cy, outerR, innerR, halfStart, halfEnd) +
            " " +
            describeArc(cx, cy, outerR, innerR, halfEnd, halfStart + 360)
        );
    }
    const largeArc = sweep > 180 ? 1 : 0;
    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
    return [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        "Z",
    ].join(" ");
}

function formatLabel(name: string): string {
    return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AlertDistributionChart() {
    const [dimension, setDimension] = useState<Dimension>("severity");

    const { data: alertsData } = useQuery({
        queryKey: ["alerts", "dashboard"],
        queryFn: () => alertsApi.list({ per_page: 100 }),
    });

    const alertItems: Alert[] = useMemo(() => {
        const items = alertsData?.items;
        return Array.isArray(items) ? items : [];
    }, [alertsData]);

    const slices: SliceData[] = useMemo(() => {
        const counts = new Map<string, number>();
        for (const alert of alertItems) {
            const key = alert[dimension] ?? "unknown";
            counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        const entries = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
        const total = entries.reduce((sum, e) => sum + e.value, 0);
        if (total === 0) return [];

        const colorMap = COLOR_MAPS[dimension];
        let angle = 0;
        return entries.map(({ name, value }) => {
            const sweep = (value / total) * 360;
            const slice: SliceData = {
                name,
                value,
                color: colorMap[name] ?? FALLBACK_COLOR,
                startAngle: angle,
                endAngle: angle + sweep,
            };
            angle += sweep;
            return slice;
        });
    }, [alertItems, dimension]);

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <strong>Alert Distribution</strong>
                <div role="group" aria-label="Alert chart dimension" style={{ display: "flex", gap: 4 }}>
                    {(["severity", "type", "state"] as Dimension[]).map((dim) => (
                        <button
                            key={dim}
                            onClick={() => setDimension(dim)}
                            style={{
                                padding: "4px 12px",
                                fontSize: 13,
                                fontWeight: dimension === dim ? 600 : 400,
                                border: "1px solid var(--pf-t--global--border--color--default, #d2d2d2)",
                                borderRadius: 4,
                                background: dimension === dim
                                    ? "var(--pf-t--global--color--brand--default, #06c)"
                                    : "var(--pf-t--global--background--color--primary--default, #fff)",
                                color: dimension === dim ? "#fff" : "inherit",
                                cursor: "pointer",
                                textTransform: "capitalize",
                            }}
                        >
                            {dim}
                        </button>
                    ))}
                </div>
            </div>

            {slices.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}>
                        {slices.map((s) => (
                            <path
                                key={s.name}
                                d={describeArc(CENTER, CENTER, RADIUS, INNER_RADIUS, s.startAngle, s.endAngle)}
                                fill={s.color}
                                stroke="var(--pf-t--global--background--color--primary--default, #fff)"
                                strokeWidth={1.5}
                            >
                                <title>{`${formatLabel(s.name)}: ${s.value}`}</title>
                            </path>
                        ))}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "center", gap: "var(--pf-t--global--spacer--lg)", flexWrap: "wrap", marginTop: "var(--pf-t--global--spacer--sm)" }}>
                        {slices.map((s) => (
                            <span key={s.name} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <span style={{ width: 12, height: 12, backgroundColor: s.color, display: "inline-block", borderRadius: 2 }} />
                                {formatLabel(s.name)}
                            </span>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "var(--pf-t--global--spacer--xl) 0", color: "var(--pf-t--global--text--color--subtle, #6a6e73)" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>&#x25EF;</div>
                    <div>No alert data to display</div>
                </div>
            )}
        </div>
    );
}
