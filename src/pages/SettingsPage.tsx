import { PageSection, Title, Card, CardBody, CardTitle } from "@patternfly/react-core";

export function SettingsPage() {
    return (
        <>
            <PageSection variant="default">
                <Title headingLevel="h1">Settings</Title>
            </PageSection>
            <PageSection>
                <Card>
                    <CardTitle>Keylime Configuration</CardTitle>
                    <CardBody>
                        Settings management is under development.
                    </CardBody>
                </Card>
            </PageSection>
        </>
    );
}
