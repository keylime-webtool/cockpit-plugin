import {
    PageSection, Title, DescriptionList, DescriptionListGroup,
    DescriptionListTerm, DescriptionListDescription,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { agentsApi } from "../api/agents";
import { StatusBadge } from "../components/StatusBadge";

interface AgentDetailPageProps {
    id: string;
}

export function AgentDetailPage({ id }: AgentDetailPageProps) {
    const { data: agent, isLoading } = useQuery({
        queryKey: ["agent", id],
        queryFn: () => agentsApi.get(id),
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
                <Title headingLevel="h1">{agent.hostname}</Title>
            </PageSection>
            <PageSection>
                <DescriptionList>
                    <DescriptionListGroup>
                        <DescriptionListTerm>UUID</DescriptionListTerm>
                        <DescriptionListDescription>{agent.uuid}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>IP Address</DescriptionListTerm>
                        <DescriptionListDescription>{agent.ip_address}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>State</DescriptionListTerm>
                        <DescriptionListDescription>
                            <StatusBadge status={agent.state} />
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>API Version</DescriptionListTerm>
                        <DescriptionListDescription>{agent.api_version}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Verifier</DescriptionListTerm>
                        <DescriptionListDescription>{agent.verifier_id}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Registrar</DescriptionListTerm>
                        <DescriptionListDescription>{agent.registrar_id}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Consecutive Failures</DescriptionListTerm>
                        <DescriptionListDescription>{agent.consecutive_failures}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Registration Date</DescriptionListTerm>
                        <DescriptionListDescription>{agent.registration_date}</DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </PageSection>
        </>
    );
}
