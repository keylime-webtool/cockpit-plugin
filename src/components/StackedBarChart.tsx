import { useRef, useState, useEffect, useMemo } from "react";

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

const CHART_HEIGHT = 280;
const BAR_GAP = 2;
const Y_AXIS_WIDTH = 50;
const X_LABEL_HEIGHT = 50;
const TOP_PADDING = 10;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StackedBarChart<T extends Record<string, any>>({ title, data, labelKey, series, formatLabel }: StackedBarChartProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1200);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });
        observer.observe(el);
        setContainerWidth(el.clientWidth);
        return () => observer.disconnect();
    }, []);

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
            <div ref={containerRef} style={{ textAlign: "center", padding: "var(--pf-t--global--spacer--xl) 0", color: "var(--pf-t--global--color--status--info--default)" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>&#x1F4CA;</div>
                <div>No {title.toLowerCase()} data</div>
            </div>
        );
    }

    const svgWidth = containerWidth;
    const plotWidth = svgWidth - Y_AXIS_WIDTH;
    const plotHeight = CHART_HEIGHT - X_LABEL_HEIGHT - TOP_PADDING;
    const barWidth = Math.max(1, (plotWidth / data.length) - BAR_GAP);

    const labelStep = barWidth < 14 ? Math.ceil(14 / (barWidth + BAR_GAP)) : 1;

    return (
        <div style={{ padding: "var(--pf-t--global--spacer--md) 0" }}>
            <strong>{title}</strong>
            <div ref={containerRef} style={{ marginTop: "var(--pf-t--global--spacer--sm)" }}>
                <svg
                    width={svgWidth}
                    height={CHART_HEIGHT}
                    viewBox={`0 0 ${svgWidth} ${CHART_HEIGHT}`}
                    style={{ display: "block" }}
                >
                    {ticks.map(tick => {
                        const y = TOP_PADDING + plotHeight - (tick / maxValue) * plotHeight;
                        return (
                            <g key={tick}>
                                <line
                                    x1={Y_AXIS_WIDTH} y1={y}
                                    x2={svgWidth} y2={y}
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
                                {i % labelStep === 0 && (
                                    <text
                                        x={x + barWidth / 2}
                                        y={CHART_HEIGHT - X_LABEL_HEIGHT + 14}
                                        textAnchor="end"
                                        fontSize={10}
                                        fill="var(--pf-t--global--text--color--subtle, #6a6e73)"
                                        transform={`rotate(-45, ${x + barWidth / 2}, ${CHART_HEIGHT - X_LABEL_HEIGHT + 14})`}
                                    >
                                        {formatLabel
                                            ? formatLabel(String(item[labelKey]))
                                            : String(item[labelKey])}
                                    </text>
                                )}
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
