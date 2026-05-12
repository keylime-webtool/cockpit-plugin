import cockpit from "cockpit";
import {
    PageSection, Title, EmptyState, EmptyStateBody,
    EmptyStateFooter, EmptyStateActions, Button,
} from "@patternfly/react-core";

export function NotFoundPage() {
    return (
        <PageSection variant="default">
            <EmptyState>
                <Title headingLevel="h1">Page Not Found</Title>
                <EmptyStateBody>
                    The page you are looking for does not exist.
                </EmptyStateBody>
                <EmptyStateFooter>
                    <EmptyStateActions>
                        <Button
                            variant="primary"
                            onClick={() => cockpit.location.go([])}
                        >
                            Go to Dashboard
                        </Button>
                    </EmptyStateActions>
                </EmptyStateFooter>
            </EmptyState>
        </PageSection>
    );
}
