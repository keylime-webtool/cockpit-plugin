import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { performanceApi } from "../api/performance";
import { KpiCard } from "../components/KpiCard";

export function PerformancePage() {
    const { data: perf } = useQuery({
        queryKey: ["performance", "system"],
        queryFn: () => performanceApi.getSystemPerformance(),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Performance</Title>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard
                            title="CPU"
                            value={perf ? `${perf.cpu_percent.toFixed(1)}%` : "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Memory"
                            value={perf ? `${perf.memory_percent.toFixed(1)}%` : "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Attestations/sec"
                            value={perf ? perf.attestations_per_sec.toFixed(1) : "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Queue Depth"
                            value={perf?.queue_depth ?? "—"}
                        />
                    </GridItem>
                </Grid>
            </PageSection>
        </>
    );
}
