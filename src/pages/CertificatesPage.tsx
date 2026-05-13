import cockpit from "cockpit";
import { PageSection, Title, Grid, GridItem, Button } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "../api/certificates";
import { KpiCard } from "../components/KpiCard";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import { ExpiryBarChart } from "../components/ExpiryBarChart";
import type { Certificate } from "../types";

const COLUMNS: ColumnDef<Certificate>[] = [
    {
        key: "subject_dn",
        title: "Subject",
        render: (c) => (
            <Button
                variant="link"
                isInline
                onClick={() => cockpit.location.go(["certificates", c.id])}
            >
                {c.subject_dn}
            </Button>
        ),
    },
    { key: "type", title: "Type", render: (c) => c.type.toUpperCase() },
    { key: "status", title: "Status", render: (c) => <StatusBadge status={c.status} /> },
    { key: "not_after", title: "Expires", render: (c) => c.not_after },
];

export function CertificatesPage() {
    const { data: summary } = useQuery({
        queryKey: ["certificates", "expiry-summary"],
        queryFn: () => certificatesApi.getExpirySummary(),
    });

    const { data: certs } = useQuery({
        queryKey: ["certificates"],
        queryFn: () => certificatesApi.list(),
    });

    const { data: timeline } = useQuery({
        queryKey: ["certificates", "timeline"],
        queryFn: () => certificatesApi.getTimeline(),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Certificates</Title>
            </PageSection>
            <PageSection>
                <Grid hasGutter>
                    <GridItem span={3}>
                        <KpiCard title="Valid" value={summary?.valid ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Expiring (30d)" value={summary?.expiring_30d ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Expiring (90d)" value={summary?.expiring_90d ?? "—"} />
                    </GridItem>
                    <GridItem span={3}>
                        <KpiCard title="Expired" value={summary?.expired ?? "—"} />
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <ExpiryBarChart data={timeline ?? []} />
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={certs?.items ?? []}
                    totalItems={certs?.total_items}
                    keyExtractor={(c) => c.id}
                />
            </PageSection>
        </>
    );
}
