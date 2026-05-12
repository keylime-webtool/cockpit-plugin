import {
    PageSection, Title, DescriptionList, DescriptionListGroup,
    DescriptionListTerm, DescriptionListDescription,
} from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { certificatesApi } from "../api/certificates";
import { StatusBadge } from "../components/StatusBadge";

interface CertificateDetailPageProps {
    id: string;
}

export function CertificateDetailPage({ id }: CertificateDetailPageProps) {
    const { data: cert, isLoading } = useQuery({
        queryKey: ["certificate", id],
        queryFn: () => certificatesApi.get(id),
    });

    if (isLoading || !cert) {
        return (
            <PageSection variant="default">
                <Title headingLevel="h1">Loading...</Title>
            </PageSection>
        );
    }

    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">{cert.subject_dn}</Title>
            </PageSection>
            <PageSection>
                <DescriptionList>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Type</DescriptionListTerm>
                        <DescriptionListDescription>{cert.type.toUpperCase()}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Status</DescriptionListTerm>
                        <DescriptionListDescription>
                            <StatusBadge status={cert.status} />
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Issuer</DescriptionListTerm>
                        <DescriptionListDescription>{cert.issuer_dn}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Serial Number</DescriptionListTerm>
                        <DescriptionListDescription>{cert.serial_number}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Valid From</DescriptionListTerm>
                        <DescriptionListDescription>{cert.not_before}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Valid Until</DescriptionListTerm>
                        <DescriptionListDescription>{cert.not_after}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Algorithm</DescriptionListTerm>
                        <DescriptionListDescription>
                            {cert.public_key_algorithm} ({cert.public_key_size} bits)
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                        <DescriptionListTerm>Validation</DescriptionListTerm>
                        <DescriptionListDescription>
                            <StatusBadge status={cert.validation_status} />
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                </DescriptionList>
            </PageSection>
        </>
    );
}
