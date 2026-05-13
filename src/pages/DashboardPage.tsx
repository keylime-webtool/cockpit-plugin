import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { kpisApi } from "../api/kpis";
import { agentsApi } from "../api/agents";
import { attestationsApi } from "../api/attestations";
import { alertsApi } from "../api/alerts";
import { KpiCard } from "../components/KpiCard";
import { AgentStateDonut } from "../components/AgentStateDonut";
import { AlertDistributionChart } from "../components/AlertDistributionChart";
import { StackedBarChart } from "../components/StackedBarChart";

const ATTESTATION_SERIES = [
    { key: "successful", label: "Successful", color: "#3e8635" },
    { key: "failed", label: "Failed", color: "#c9190b" },
    { key: "timed_out", label: "Timed Out", color: "#f0ab00" },
];

function formatTimelineLabel(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { month: "short", day: "numeric" })
        + ", "
        + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
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

    const { data: summary } = useQuery({
        queryKey: ["attestations", "summary", "30d"],
        queryFn: () => attestationsApi.getSummary("30d"),
    });

    const { data: alertSummary } = useQuery({
        queryKey: ["alerts", "summary"],
        queryFn: () => alertsApi.getSummary(),
    });

    const { data: timeline } = useQuery({
        queryKey: ["attestations", "timeline", "30d"],
        queryFn: () => attestationsApi.getTimeline("30d"),
    });

    const totalAgents = kpis ? kpis.total_active_agents + kpis.failed_agents : undefined;

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Dashboard</Title>
            </PageSection>

            {/* KPI cards row */}
            <PageSection>
                <div style={{ display: "flex", gap: "var(--pf-t--global--spacer--md)" }}>
                    <div style={{ flex: 1 }}>
                        <KpiCard title="Total Agents" value={totalAgents ?? "—"} linkTo="agents" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <KpiCard
                            title="Attestation Success Rate"
                            value={summary ? `${summary.success_rate.toFixed(2)}%` : "—"}
                            linkTo="attestations"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <KpiCard
                            title="Failed Attestations"
                            value={summary?.total_failed ?? "—"}
                            subtitle="in last 30d"
                            linkTo="attestations"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <KpiCard
                            title="Timed-Out Attestations"
                            value={summary?.total_timed_out ?? "—"}
                            subtitle="in last 30d"
                            linkTo="attestations"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <KpiCard
                            title="Urgent Alerts"
                            value={alertSummary?.active_critical ?? "—"}
                            subtitle={alertSummary
                                ? `${alertSummary.critical} critical, ${alertSummary.warnings} warnings`
                                : undefined}
                            linkTo="alerts"
                        />
                    </div>
                </div>
            </PageSection>

            {/* Agent State Distribution + Alert Distribution side by side */}
            <PageSection>
                <div style={{ display: "flex", gap: "var(--pf-t--global--spacer--lg)" }}>
                    <div style={{ flex: 3 }}>
                        <AgentStateDonut agents={agentsData?.items ?? []} />
                    </div>
                    <div style={{ flex: 2 }}>
                        <AlertDistributionChart />
                    </div>
                </div>
            </PageSection>

            {/* Attestation Success Rate (30d) bar chart */}
            <PageSection>
                <StackedBarChart
                    title="Attestation Success Rate (30d)"
                    data={timeline ?? []}
                    labelKey="hour"
                    series={ATTESTATION_SERIES}
                    formatLabel={formatTimelineLabel}
                />
            </PageSection>
        </>
    );
}
