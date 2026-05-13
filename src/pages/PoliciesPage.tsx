import { PageSection, Title } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { policiesApi } from "../api/policies";
import { DataTable, type ColumnDef } from "../components/DataTable";
import type { Policy } from "../types";

export function formatKind(kind: string): string {
    switch (kind) {
    case "ima": return "IMA";
    case "measured_boot": return "Measured Boot";
    default: return kind;
    }
}

const COLUMNS: ColumnDef<Policy>[] = [
    { key: "name", title: "Name", sortable: true, render: (p) => p.name },
    { key: "kind", title: "Kind", render: (p) => formatKind(p.kind) },
    { key: "checksum", title: "Checksum", render: (p) => p.checksum || "—" },
    { key: "assigned_agents", title: "Assigned Agents", render: (p) => p.assigned_agents },
];

export function PoliciesPage() {
    const { data: policies } = useQuery({
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
                    items={policies ?? []}
                    keyExtractor={(p) => p.id}
                />
            </PageSection>
        </>
    );
}
