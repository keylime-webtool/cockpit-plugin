import { useMemo } from "react";

interface StackedBarSeries {
    key: string;
    label: string;
    color: string;
}

interface StackedBarChartProps<T> {
    title: string;
    data: T[];
    labelKey: keyof T & string;
    series: StackedBarSeries[];
    formatLabel?: (raw: string) => string;
}

const CHART_HEIGHT = 260;
const BAR_GAP = 2;
const Y_AXIS_WIDTH = 45;
const X_LABEL_HEIGHT = 40;
const TOP_PADDING = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StackedBarChart<T extends Record<string, any>>({ title, data, labelKey, series, formatLabel }: StackedBarChartProps<T>) {
    const { maxValue, ticks } = useMemo(() => {
        let max = 0;
        for (const item of data) {
            let stackTotal = 0;
            for (const s of series) {
                stackTotal += (item[s.key] as number) ?? 0;
            }
            if (stackTotal > max) max = stackTotal;
        }
        if (max === 0) max = 10;

        const step = Math.ceil(max / 4);
        const roundedMax = step * 4;
        const tickValues = [0, step, step * 2, step * 3, roundedMax];
        return { maxValue: roundedMax, ticks: tickValues };
    }, [data, series]);

    if (data.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "var(--pf-t--global--spacer--xl) 0", color: "var(--pf-t--global--color--status--info--default)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F4CA;</div>
                <div>No {title.toLowerCase()} data</div>
            </div>
        );
    }

    const plotWidth = 800 - Y_AXIS_WIDTH;
    const plotHeight = CHART_HEIGHT - X_LABEL_HEIGHT - TOP_PADDING;
    const barWidth = Math.max(4, (plotWidth / data.length) - BAR_GAP);

    return (
        <div style={{ padding: "var(--pf-t--global--spacer--md) 0" }}>
            <strong>{title}</strong>
            <div style={{ overflowX: "auto", marginTop: "var(--pf-t--global--spacer--sm)" }}>
                <svg
                    width="100%"
                    height={CHART_HEIGHT}
                    viewBox={`0 0 800 ${CHART_HEIGHT}`}
                    preserveAspectRatio="xMinYMid meet"
                    style={{ display: "block" }}
                >
                    {ticks.map(tick => {
                        const y = TOP_PADDING + plotHeight - (tick / maxValue) * plotHeight;
                        return (
                            <g key={tick}>
                                <line
                                    x1={Y_AXIS_WIDTH} y1={y}
                                    x2={800} y2={y}
                                    stroke="var(--pf-t--global--border--color--default, #d2d2d2)"
                                    strokeDasharray="3 3"
                                />
                                <text
                                    x={Y_AXIS_WIDTH - 6} y={y + 4}
                                    textAnchor="end"
                                    fontSize={11}
                                    fill="var(--pf-t--global--text--color--subtle, #6a6e73)"
                                >
                                    {tick}
                                </text>
                            </g>
                        );
                    })}

                    {data.map((item, i) => {
                        const x = Y_AXIS_WIDTH + i * (barWidth + BAR_GAP) + BAR_GAP / 2;
                        let yOffset = 0;

                        return (
                            <g key={i}>
                                {series.map(s => {
                                    const value = (item[s.key] as number) ?? 0;
                                    const barHeight = (value / maxValue) * plotHeight;
                                    const y = TOP_PADDING + plotHeight - yOffset - barHeight;
                                    yOffset += barHeight;
                                    return (
                                        <rect
                                            key={s.key}
                                            x={x} y={y}
                                            width={barWidth}
                                            height={Math.max(0, barHeight)}
                                            fill={s.color}
                                            rx={1}
                                        >
                                            <title>{`${s.label}: ${value}`}</title>
                                        </rect>
                                    );
                                })}
                                <text
                                    x={x + barWidth / 2}
                                    y={CHART_HEIGHT - X_LABEL_HEIGHT + 14}
                                    textAnchor="middle"
                                    fontSize={10}
                                    fill="var(--pf-t--global--text--color--subtle, #6a6e73)"
                                    transform={`rotate(-45, ${x + barWidth / 2}, ${CHART_HEIGHT - X_LABEL_HEIGHT + 14})`}
                                >
                                    {formatLabel
                                        ? formatLabel(String(item[labelKey]))
                                        : String(item[labelKey])}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--pf-t--global--spacer--lg)", flexWrap: "wrap", marginTop: "var(--pf-t--global--spacer--sm)" }}>
                {series.map(s => (
                    <span key={s.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                        <span style={{ width: 12, height: 12, backgroundColor: s.color, display: "inline-block", borderRadius: 2 }} />
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
