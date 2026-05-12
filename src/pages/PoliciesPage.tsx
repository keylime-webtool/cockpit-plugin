import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { policiesApi } from "../api/policies";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { Policy } from "../types";

const COLUMNS: ColumnDef<Policy>[] = [
    { key: "name", title: "Name", sortable: true, render: (p) => p.name },
    { key: "kind", title: "Kind", render: (p) => p.kind },
    { key: "approval_state", title: "Status", render: (p) => <StatusBadge status={p.approval_state} /> },
    { key: "hash_algorithm", title: "Hash", render: (p) => p.hash_algorithm },
    { key: "updated_date", title: "Updated", render: (p) => p.updated_date },
];

export function PoliciesPage() {
    const { data } = useQuery({
        queryKey: ["policies"],
        queryFn: () => policiesApi.list(),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Policies</Title>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={data?.items ?? []}
                    totalItems={data?.total_items}
                    keyExtractor={(p) => p.id}
                />
            </PageSection>
        </>
    );
}
