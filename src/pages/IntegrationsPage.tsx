import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { performanceApi } from "../api/performance";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { IntegrationService } from "../types";

const COLUMNS: ColumnDef<IntegrationService>[] = [
    { key: "name", title: "Service", render: (s) => s.name },
    { key: "endpoint", title: "Endpoint", render: (s) => s.endpoint },
    { key: "status", title: "Status", render: (s) => <StatusBadge status={s.status} /> },
    { key: "latency", title: "Latency", render: (s) => s.latency_ms ? `${s.latency_ms} ms` : "—" },
];

export function IntegrationsPage() {
    const { data: services } = useQuery({
        queryKey: ["integrations", "status"],
        queryFn: () => performanceApi.getIntegrationStatus(),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Integrations</Title>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={services ?? []}
                    keyExtractor={(s) => s.name}
                />
            </PageSection>
        </>
    );
}
