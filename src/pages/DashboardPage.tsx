import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { kpisApi } from "../api/kpis";
import { agentsApi } from "../api/agents";
import { attestationsApi } from "../api/attestations";
import { KpiCard } from "../components/KpiCard";
import { AgentStateDonut } from "../components/AgentStateDonut";
import { StackedBarChart } from "../components/StackedBarChart";

const ATTESTATION_SERIES = [
    { key: "successful", label: "Successful", color: "#3e8635" },
    { key: "failed", label: "Failed", color: "#c9190b" },
    { key: "timed_out", label: "Timed Out", color: "#f0ab00" },
];

function formatHour(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function DashboardPage() {
    const { data: kpis } = useQuery({
        queryKey: ["kpis"],
        queryFn: () => kpisApi.getFleetKpis(),
    });

    const { data: agentsData } = useQuery({
        queryKey: ["agents"],
        queryFn: () => agentsApi.list({ per_page: 50 }),
    });

    const { data: timeline } = useQuery({
        queryKey: ["attestations", "timeline", "24h"],
        queryFn: () => attestationsApi.getTimeline("24h"),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Dashboard</Title>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard title="Active Agents" value={kpis?.total_active_agents ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Failed Agents" value={kpis?.failed_agents ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Success Rate"
                            value={kpis ? `${kpis.attestation_success_rate.toFixed(1)}%` : "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Avg Latency"
                            value={kpis ? `${kpis.average_attestation_latency_ms.toFixed(0)} ms` : "—"} />
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <StackedBarChart
                    title="Attestation Success Rate (24h)"
                    data={timeline ?? []}
                    labelKey="hour"
                    series={ATTESTATION_SERIES}
                    formatLabel={formatHour}
                />
            </PageSection>
            <PageSection>
                <AgentStateDonut agents={agentsData?.items ?? []} />
            </PageSection>
        </>
    );
}
