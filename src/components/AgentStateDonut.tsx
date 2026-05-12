import { useMemo } from "react";
import type { Agent } from "../types";

interface AgentStateDonutProps {
    agents: Agent[];
}

export function AgentStateDonut({ agents }: AgentStateDonutProps) {
    const counts = useMemo(() => {
        const map: Record<string, number> = {};
        for (const a of agents) {
            const key = `${a.state} (${a.attestation_mode})`;
            map[key] = (map[key] ?? 0) + 1;
        }
        return map;
    }, [agents]);

    const entries = Object.entries(counts);
    const total = entries.reduce((s, [, v]) => s + v, 0);
    if (total === 0) return null;

    const colorMap: Record<string, string> = {
        PASS: "#3e8635",
        FAIL: "#c9190b",
        TIMEOUT: "#f0ab00",
    };

    const size = 200;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = 90;
    const innerR = 55;

    let cumulative = 0;
    const segments = entries.map(([label, count]) => {
        const state = label.split(" ")[0];
        const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        cumulative += count;
        const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
        const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

        const x1Outer = cx + outerR * Math.cos(startAngle);
        const y1Outer = cy + outerR * Math.sin(startAngle);
        const x2Outer = cx + outerR * Math.cos(endAngle);
        const y2Outer = cy + outerR * Math.sin(endAngle);
        const x1Inner = cx + innerR * Math.cos(endAngle);
        const y1Inner = cy + innerR * Math.sin(endAngle);
        const x2Inner = cx + innerR * Math.cos(startAngle);
        const y2Inner = cy + innerR * Math.sin(startAngle);

        const d = [
            `M ${x1Outer} ${y1Outer}`,
            `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
            `L ${x1Inner} ${y1Inner}`,
            `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
            "Z",
        ].join(" ");

        return { label, d, color: colorMap[state] ?? "#8a8d90" };
    });

    return (
        <div style={{ textAlign: "center", padding: "var(--pf-t--global--spacer--lg) 0" }}>
            <strong>Agent State Distribution</strong>
            <div style={{ display: "flex", justifyContent: "center", margin: "var(--pf-t--global--spacer--md) 0" }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {segments.map((s) => (
                        <path key={s.label} d={s.d} fill={s.color} />
                    ))}
                </svg>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "var(--pf-t--global--spacer--lg)", flexWrap: "wrap" }}>
                {segments.map((s) => (
                    <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 12, height: 12, backgroundColor: s.color, display: "inline-block" }} />
                        {s.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
