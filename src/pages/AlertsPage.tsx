import { PageSection, Title, Grid, GridItem } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { alertsApi } from "../api/alerts";
import { KpiCard } from "../components/KpiCard";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { Alert } from "../types";

const COLUMNS: ColumnDef<Alert>[] = [
    { key: "type", title: "Type", render: (a) => a.type.replace(/_/g, " ") },
    { key: "severity", title: "Severity", render: (a) => <StatusBadge status={a.severity} /> },
    { key: "state", title: "State", render: (a) => <StatusBadge status={a.state} /> },
    { key: "description", title: "Description", render: (a) => a.description },
    { key: "created", title: "Created", render: (a) => a.created_timestamp },
];

export function AlertsPage() {
    const [page, setPage] = useState(1);

    const { data: summary } = useQuery({
        queryKey: ["alerts", "summary"],
        queryFn: () => alertsApi.getSummary(),
    });

    const { data: alerts } = useQuery({
        queryKey: ["alerts", page],
        queryFn: () => alertsApi.list({ page, per_page: 25 }),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Alerts</Title>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard title="Critical" value={summary?.critical ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Warnings" value={summary?.warnings ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Info" value={summary?.info ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Active" value={summary?.active_alerts ?? "—"} />
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={alerts?.items ?? []}
                    totalItems={alerts?.total_items}
                    page={page}
                    onPageChange={setPage}
                    keyExtractor={(a) => a.id}
                />
            </PageSection>
        </>
    );
}
