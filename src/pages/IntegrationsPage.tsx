import { useMemo } from "react";
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
    const { data: services, isError: backendDown, fetchStatus } = useQuery({
        queryKey: ["integrations", "status"],
        queryFn: () => performanceApi.getIntegrationStatus(),
        refetchInterval: 10_000,
        retry: false,
    });

    const allServices: IntegrationService[] = useMemo(() => {
        const backendEntry: IntegrationService = {
            name: "keylime-webtool-backend",
            endpoint: "http://127.0.0.1:8080",
            status: backendDown ? "DOWN" as IntegrationService["status"] : "UP" as IntegrationService["status"],
            latency_ms: undefined,
        };
        if (backendDown || fetchStatus === "fetching") {
            return [backendEntry];
        }
        return [backendEntry, ...(services ?? [])];
    }, [services, backendDown, fetchStatus]);

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Integrations</Title>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={allServices}
                    keyExtractor={(s) => s.name}
                />
            </PageSection>
        </>
    );
}
