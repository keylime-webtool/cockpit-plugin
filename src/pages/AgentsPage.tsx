import cockpit from "cockpit";
import { PageSection, Title, Button } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { agentsApi } from "../api/agents";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { StatusBadge } from "../components/StatusBadge";
import type { Agent } from "../types";

const COLUMNS: ColumnDef<Agent>[] = [
    {
        key: "hostname",
        title: "Hostname",
        sortable: true,
        render: (agent) => (
            <Button
                variant="link"
                isInline
                onClick={() => cockpit.location.go(["agents", agent.uuid])}
            >
                {agent.hostname}
            </Button>
        ),
    },
    { key: "ip_address", title: "IP Address", render: (a) => a.ip_address },
    { key: "state", title: "State", render: (a) => <StatusBadge status={a.state} /> },
    { key: "last_attestation", title: "Last Attestation", render: (a) => a.last_attestation ?? "—" },
    { key: "failures", title: "Failures", render: (a) => String(a.consecutive_failures) },
];

export function AgentsPage() {
    const [page, setPage] = useState(1);

    const { data } = useQuery({
        queryKey: ["agents", page],
        queryFn: () => agentsApi.list({ page, per_page: 25 }),
    });

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Agents</Title>
            </PageSection>
            <PageSection>
                <DataTable
                    columns={COLUMNS}
                    items={data?.items ?? []}
                    totalItems={data?.total_items}
                    page={page}
                    onPageChange={setPage}
                    keyExtractor={(a) => a.uuid}
                />
            </PageSection>
        </>
    );
}
