import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { attestationsApi } from "../api/attestations";
import { KpiCard } from "../components/KpiCard";

export function AttestationsPage() {
    const { data: summary } = useQuery({
        queryKey: ["attestations", "summary"],
        queryFn: () => attestationsApi.getSummary("24h"),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Attestations</Title>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard
                            title="Successful"
                            value={summary?.total_successful ?? "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Failed"
                            value={summary?.total_failed ?? "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Timed Out"
                            value={summary?.total_timed_out ?? "—"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Success Rate"
                            value={summary ? `${summary.success_rate.toFixed(1)}%` : "—"}
                        />
                    </GridItem>
                </Grid>
            </PageSection>
        </>
    );
}
