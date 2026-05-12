import cockpit from "cockpit";
import {
    PageSection, Title, Content,
    Toolbar, ToolbarContent, ToolbarItem, ToolbarGroup,
    SearchInput, Button,
    Select, SelectOption, MenuToggleElement, MenuToggle,
} from "@patternfly/react-core";
import { Table, Thead, Tbody, Tr, Th, Td } from "@patternfly/react-table";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { agentsApi } from "../api/agents";
import { StatusBadge } from "../components/StatusBadge";
import type { Agent } from "../types";

const STATE_OPTIONS = ["All states", "PASS", "FAIL", "TIMEOUT"];
const MODE_OPTIONS = ["All modes", "Push", "Pull"];

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
}

interface DonutChartProps {
    agents: Agent[];
}

function DonutChart({ agents }: DonutChartProps) {
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

export function AgentsPage() {
    const [search, setSearch] = useState("");
    const [stateFilter, setStateFilter] = useState("All states");
    const [modeFilter, setModeFilter] = useState("All modes");
    const [stateOpen, setStateOpen] = useState(false);
    const [modeOpen, setModeOpen] = useState(false);

    const { data } = useQuery({
        queryKey: ["agents"],
        queryFn: () => agentsApi.list({ per_page: 50 }),
    });

    const filtered = useMemo(() => {
        let items = data?.items ?? [];
        if (search) {
            const q = search.toLowerCase();
            items = items.filter(a =>
                a.id.toLowerCase().includes(q) || a.ip.includes(q)
            );
        }
        if (stateFilter !== "All states") {
            items = items.filter(a => a.state === stateFilter);
        }
        if (modeFilter !== "All modes") {
            items = items.filter(a => a.attestation_mode === modeFilter);
        }
        return items;
    }, [data, search, stateFilter, modeFilter]);

    const allAgents = data?.items ?? [];

    return (
        <>
            <PageSection variant="default">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <Title headingLevel="h1">Agents</Title>
                        <Content component="p">Manage and monitor Keylime agents across your fleet</Content>
                    </div>
                    <Button variant="secondary" onClick={() => { setSearch(""); setStateFilter("All states"); setModeFilter("All modes"); }}>
                        Show All Agents
                    </Button>
                </div>
            </PageSection>
            <PageSection>
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarItem style={{ flex: 1 }}>
                            <SearchInput
                                placeholder="Search by UUID, hostname, or IP..."
                                value={search}
                                onChange={(_e, val) => setSearch(val)}
                                onClear={() => setSearch("")}
                            />
                        </ToolbarItem>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Select
                                    isOpen={stateOpen}
                                    selected={stateFilter}
                                    onSelect={(_e, val) => { setStateFilter(val as string); setStateOpen(false); }}
                                    onOpenChange={setStateOpen}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle ref={toggleRef} onClick={() => setStateOpen(!stateOpen)} isExpanded={stateOpen}>
                                            {stateFilter}
                                        </MenuToggle>
                                    )}
                                >
                                    {STATE_OPTIONS.map(o => <SelectOption key={o} value={o}>{o}</SelectOption>)}
                                </Select>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Select
                                    isOpen={modeOpen}
                                    selected={modeFilter}
                                    onSelect={(_e, val) => { setModeFilter(val as string); setModeOpen(false); }}
                                    onOpenChange={setModeOpen}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle ref={toggleRef} onClick={() => setModeOpen(!modeOpen)} isExpanded={modeOpen}>
                                            {modeFilter}
                                        </MenuToggle>
                                    )}
                                >
                                    {MODE_OPTIONS.map(o => <SelectOption key={o} value={o}>{o}</SelectOption>)}
                                </Select>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>

                <Table aria-label="Agents table" variant="compact">
                    <Thead>
                        <Tr>
                            <Th>Agent ID</Th>
                            <Th>IP:Port</Th>
                            <Th>Mode</Th>
                            <Th>State</Th>
                            <Th>Last Attestation</Th>
                            <Th>Failures</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filtered.map(agent => (
                            <Tr key={agent.id}>
                                <Td dataLabel="Agent ID">
                                    <Button
                                        variant="link"
                                        isInline
                                        onClick={() => cockpit.location.go(["agents", agent.id])}
                                    >
                                        {agent.id}
                                    </Button>
                                </Td>
                                <Td dataLabel="IP:Port">{agent.ip}:{agent.port}</Td>
                                <Td dataLabel="Mode">{agent.attestation_mode}</Td>
                                <Td dataLabel="State"><StatusBadge status={agent.state} /></Td>
                                <Td dataLabel="Last Attestation">{formatDate(agent.last_attestation)}</Td>
                                <Td dataLabel="Failures">{agent.failure_count}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                <DonutChart agents={allAgents} />
            </PageSection>
        </>
    );
}
