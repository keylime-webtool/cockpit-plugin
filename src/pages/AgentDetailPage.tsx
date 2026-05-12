import {
    PageSection, Title, DescriptionList, DescriptionListGroup,
    DescriptionListTerm, DescriptionListDescription,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { agentsApi } from "../api/agents";
import { StatusBadge } from "../components/StatusBadge";
import type { AgentDetail } from "../types";

interface AgentDetailPageProps {
    id: string;
}

export function AgentDetailPage({ id }: AgentDetailPageProps) {
    const { data: agent, isLoading } = useQuery({
        queryKey: ["agent", id],
        queryFn: () => agentsApi.get(id) as Promise<AgentDetail>,
    });

    if (isLoading || !agent) {
        return (
            <PageSection variant="default">
                <Title headingLevel="h1">Loading...</Title>
            </PageSection>
        );
    }

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Agent {agent.id}</Title>
            </PageSection>
            <PageSection>
                <DescriptionList>
                    <DescriptionListGroup>
                        <DescriptionListTerm>ID</DescriptionListTerm>
                        <DescriptionListDescription>{agent.id}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>IP:Port</DescriptionListTerm>
                        <DescriptionListDescription>{agent.ip}:{agent.port}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>State</DescriptionListTerm>
                        <DescriptionListDescription>
                            <StatusBadge status={agent.state} />
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Mode</DescriptionListTerm>
                        <DescriptionListDescription>{agent.attestation_mode}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Failure Count</DescriptionListTerm>
                        <DescriptionListDescription>{agent.failure_count}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Last Attestation</DescriptionListTerm>
                        <DescriptionListDescription>{agent.last_attestation}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Registration Count</DescriptionListTerm>
                        <DescriptionListDescription>{agent.regcount}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>TPM Encryption Algorithms</DescriptionListTerm>
                        <DescriptionListDescription>{agent.accept_tpm_encryption_algs?.join(", ")}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>TPM Hash Algorithms</DescriptionListTerm>
                        <DescriptionListDescription>{agent.accept_tpm_hash_algs?.join(", ")}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>TPM Signing Algorithms</DescriptionListTerm>
                        <DescriptionListDescription>{agent.accept_tpm_signing_algs?.join(", ")}</DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </PageSection>
        </>
    );
}
