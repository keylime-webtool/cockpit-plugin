import { useMemo } from "react";
import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { performanceApi } from "../api/performance";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { IntegrationService } from "../types";

interface IntegrationResult {
    services: IntegrationService[];
    backendLatencyMs: number;
}

const COLUMNS: ColumnDef<IntegrationService>[] = [
    { key: "name", title: "Service", render: (s) => s.name },
    { key: "endpoint", title: "Endpoint", render: (s) => s.endpoint },
    { key: "status", title: "Status", render: (s) => <StatusBadge status={s.status} /> },
    { key: "latency", title: "Latency", render: (s) => s.latency_ms != null ? `${s.latency_ms} ms` : "—" },
];

export function IntegrationsPage() {
    const { data, isError: backendDown, fetchStatus } = useQuery<IntegrationResult>({
        queryKey: ["integrations", "status"],
        queryFn: async () => {
            const start = performance.now();
            const services = await performanceApi.getIntegrationStatus();
            const backendLatencyMs = Math.round(performance.now() - start);
            return { services, backendLatencyMs };
        },
        refetchInterval: 10_000,
        retry: false,
    });

    const allServices: IntegrationService[] = useMemo(() => {
        const backendEntry: IntegrationService = {
            name: "keylime-webtool-backend",
            endpoint: "http://127.0.0.1:8080",
            status: backendDown ? "DOWN" as IntegrationService["status"] : "UP" as IntegrationService["status"],
            latency_ms: data?.backendLatencyMs,
        };
        if (backendDown || fetchStatus === "fetching") {
            return [backendEntry];
        }
        return [backendEntry, ...(data?.services ?? [])];
    }, [data, backendDown, fetchStatus]);

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
