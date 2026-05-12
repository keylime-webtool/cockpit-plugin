import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { auditApi } from "../api/audit";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { AuditLogEntry } from "../types";

const COLUMNS: ColumnDef<AuditLogEntry>[] = [
    { key: "timestamp", title: "Time", sortable: true, render: (e) => e.timestamp },
    { key: "actor", title: "Actor", render: (e) => e.actor },
    { key: "action", title: "Action", render: (e) => e.action.replace(/_/g, " ") },
    { key: "resource", title: "Resource", render: (e) => `${e.resource_type}/${e.resource_id}` },
    { key: "result", title: "Result", render: (e) => <StatusBadge status={e.result} /> },
    { key: "severity", title: "Severity", render: (e) => <StatusBadge status={e.severity} /> },
];

export function AuditLogPage() {
    const [page, setPage] = useState(1);

    const { data } = useQuery({
        queryKey: ["audit-log", page],
        queryFn: () => auditApi.list({ page, per_page: 25 }),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Audit Log</Title>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={data?.items ?? []}
                    totalItems={data?.total_items}
                    page={page}
                    onPageChange={setPage}
                    keyExtractor={(e) => e.id}
                />
            </PageSection>
        </>
    );
}
