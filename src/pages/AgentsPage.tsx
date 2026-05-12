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
import { AgentStateDonut } from "../components/AgentStateDonut";

const STATE_OPTIONS = ["All states", "PASS", "FAIL", "TIMEOUT"];
const MODE_OPTIONS = ["All modes", "Push", "Pull"];

function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
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

                <AgentStateDonut agents={allAgents} />
            </PageSection>
        </>
    );
}
