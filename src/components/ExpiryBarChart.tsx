import { useMemo } from "react";
import type { CertificateTimelineEntry, ExpiryCategory } from "../types";

const EXPIRY_COLORS: Record<ExpiryCategory, string> = {
    valid: "#3e8635",
    warning_90d: "#4285f4",
    warning_30d: "#f9ab00",
    critical_7d: "#e8710a",
    critical_1d: "#ea4335",
    expired: "#991b1b",
};

const EXPIRY_LABELS: Record<ExpiryCategory, string> = {
    valid: "Valid",
    warning_90d: "90-day warning",
    warning_30d: "30-day warning",
    critical_7d: "7-day critical",
    critical_1d: "1-day critical",
    expired: "Expired",
};

const CHART_HEIGHT = 260;
const BAR_GAP = 2;
const Y_AXIS_WIDTH = 35;
const X_LABEL_HEIGHT = 40;
const TOP_PADDING = 10;

interface ExpiryBarChartProps {
    data: CertificateTimelineEntry[];
}

export function ExpiryBarChart({ data }: ExpiryBarChartProps) {
    const maxValue = useMemo(() => {
        let max = 0;
        for (const d of data) {
            if (d.count > max) max = d.count;
        }
        return max === 0 ? 10 : Math.ceil(max * 1.1);
    }, [data]);

    if (data.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "var(--pf-t--global--spacer--xl) 0", color: "var(--pf-t--global--color--status--info--default)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F4C5;</div>
                <div>No timeline data available</div>
            </div>
        );
    }

    const plotWidth = 800 - Y_AXIS_WIDTH;
    const plotHeight = CHART_HEIGHT - X_LABEL_HEIGHT - TOP_PADDING;
    const barWidth = Math.max(4, (plotWidth / data.length) - BAR_GAP);

    const step = Math.ceil(maxValue / 4);
    const ticks = [0, step, step * 2, step * 3, step * 4];

    return (
        <div style={{ padding: "var(--pf-t--global--spacer--md) 0" }}>
            <strong>90-Day Expiry Timeline</strong>
            <div style={{ overflowX: "auto", marginTop: "var(--pf-t--global--spacer--sm)" }}>
                <svg
                    width="100%"
                    height={CHART_HEIGHT}
                    viewBox={`0 0 800 ${CHART_HEIGHT}`}
                    preserveAspectRatio="xMinYMid meet"
                    style={{ display: "block" }}
                >
                    {ticks.map(tick => {
                        const y = TOP_PADDING + plotHeight - (tick / (step * 4)) * plotHeight;
                        return (
                            <g key={tick}>
                                <line
                                    x1={Y_AXIS_WIDTH} y1={y}
                                    x2={800} y2={y}
                                    stroke="var(--pf-t--global--border--color--default, #d2d2d2)"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={Y_AXIS_WIDTH - 4} y={y + 4}
                                    textAnchor="end" fontSize={11}
                                    fill="var(--pf-t--global--text--color--subtle, #6a6e73)"
                                >
                                    {tick}
                                </text>
                            </g>
                        );
                    })}

                    {data.map((entry, i) => {
                        const x = Y_AXIS_WIDTH + i * (barWidth + BAR_GAP) + BAR_GAP / 2;
                        const barHeight = (entry.count / (step * 4)) * plotHeight;
                        const y = TOP_PADDING + plotHeight - barHeight;
                        const color = EXPIRY_COLORS[entry.expiry_category] ?? "#6b7280";

                        return (
                            <g key={i}>
                                <rect
                                    x={x} y={y}
                                    width={barWidth}
                                    height={Math.max(0, barHeight)}
                                    fill={color}
                                    rx={2}
                                >
                                    <title>{`${entry.date}: ${entry.count} (${EXPIRY_LABELS[entry.expiry_category] ?? entry.expiry_category})`}</title>
                                </rect>
                                {data.length <= 30 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={CHART_HEIGHT - X_LABEL_HEIGHT + 14}
                                        textAnchor="middle" fontSize={10}
                                        fill="var(--pf-t--global--text--color--subtle, #6a6e73)"
                                        transform={`rotate(-45, ${x + barWidth / 2}, ${CHART_HEIGHT - X_LABEL_HEIGHT + 14})`}
                                    >
                                        {entry.date}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--pf-t--global--spacer--lg)", flexWrap: "wrap", marginTop: "var(--pf-t--global--spacer--sm)" }}>
                {(Object.keys(EXPIRY_COLORS) as ExpiryCategory[]).map(cat => (
                    <span key={cat} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                        <span style={{ width: 12, height: 12, backgroundColor: EXPIRY_COLORS[cat], display: "inline-block", borderRadius: 2 }} />
                        {EXPIRY_LABELS[cat]}
                    </span>
                ))}
            </div>
        </div>
    );
}
