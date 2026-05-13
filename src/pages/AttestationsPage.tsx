import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { attestationsApi } from "../api/attestations";
import { KpiCard } from "../components/KpiCard";
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

export function AttestationsPage() {
    const { data: summary } = useQuery({
        queryKey: ["attestations", "summary"],
        queryFn: () => attestationsApi.getSummary("24h"),
    });

    const { data: timeline } = useQuery({
        queryKey: ["attestations", "timeline", "24h"],
        queryFn: () => attestationsApi.getTimeline("24h"),
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
            <PageSection>
                <StackedBarChart
                    title="Hourly Volume"
                    data={timeline ?? []}
                    labelKey="hour"
                    series={ATTESTATION_SERIES}
                    formatLabel={formatHour}
                />
            </PageSection>
        </>
    );
}
