import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { kpisApi } from "../api/kpis";
import { KpiCard } from "../components/KpiCard";

export function DashboardPage() {
    const { data: kpis } = useQuery({
        queryKey: ["kpis"],
        queryFn: () => kpisApi.getFleetKpis(),
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
        </>
    );
}
