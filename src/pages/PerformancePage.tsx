import { PageSection, Title, Grid, GridItem, Content } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { performanceApi } from "../api/performance";
import { KpiCard } from "../components/KpiCard";

export const CIRCUIT_BREAKER_LABELS: Record<string, string> = {
    closed: "Closed",
    open: "Open",
    half_open: "Half-Open",
};

type CbVariant = "success" | "danger" | "warning";

export const CIRCUIT_BREAKER_VARIANTS: Record<string, CbVariant> = {
    closed: "success",
    open: "danger",
    half_open: "warning",
};

export function capacityVariant(pct: number): "default" | "warning" | "danger" {
    if (pct > 90) return "danger";
    if (pct > 70) return "warning";
    return "default";
}

export function PerformancePage() {
    const { data: perf } = useQuery({
        queryKey: ["performance", "summary"],
        queryFn: () => performanceApi.getSummary(),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">System Performance</Title>
                <Content component="p">
                    Monitor Keylime verifier cluster health and resource utilization
                </Content>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard
                            title="Verifier Status"
                            value={perf ? (perf.verifier_reachable ? "Reachable" : "Unreachable") : "--"}
                            subtitle={perf?.verifier_latency_ms != null ? `${perf.verifier_latency_ms} ms` : undefined}
                            variant={perf ? (perf.verifier_reachable ? "success" : "danger") : "default"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Circuit Breaker"
                            value={perf ? (CIRCUIT_BREAKER_LABELS[perf.circuit_breaker_state] ?? perf.circuit_breaker_state) : "--"}
                            variant={perf ? (CIRCUIT_BREAKER_VARIANTS[perf.circuit_breaker_state] ?? "default") : "default"}
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Attestation Rate"
                            value={perf?.estimated_attestation_rate != null ? `${perf.estimated_attestation_rate}/s` : "--"}
                            variant="success"
                        />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard
                            title="Capacity"
                            value={perf?.capacity_utilization_pct != null ? `${perf.capacity_utilization_pct.toFixed(1)}%` : "--"}
                            variant={perf?.capacity_utilization_pct != null ? capacityVariant(perf.capacity_utilization_pct) : "default"}
                        />
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={6}>
                        <Title headingLevel="h2">Verifier Cluster Metrics</Title>
                        <Content component="p">
                            CPU, memory, open FDs, thread pool, and network connections over time.
                        </Content>
                    </GridItem>
                    <GridItem span={6}>
                        <Title headingLevel="h2">Database Pool Status</Title>
                        <Content component="p">
                            Active/idle/overflow connections, average query time, slow query detection (&gt;100ms).
                        </Content>
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <Title headingLevel="h2">Circuit Breaker Status</Title>
                <Content component="p">
                    Verifier API circuit breaker: current state (Closed/Open/Half-Open), failure count, and next retry time.
                </Content>
            </PageSection>
        </>
    );
}
