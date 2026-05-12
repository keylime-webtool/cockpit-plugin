import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Page, PageSection } from "@patternfly/react-core";
import { usePageLocation } from "./hooks/usePageLocation";
import { useCockpitAuth } from "./store/cockpitAuth";
import { useVisualizationStore } from "./store/visualizationStore";
import { NavigationMenu } from "./components/NavigationMenu";
import { DashboardPage } from "./pages/DashboardPage";
import { AgentsPage } from "./pages/AgentsPage";
import { AgentDetailPage } from "./pages/AgentDetailPage";
import { AttestationsPage } from "./pages/AttestationsPage";
import { PoliciesPage } from "./pages/PoliciesPage";
import { CertificatesPage } from "./pages/CertificatesPage";
import { CertificateDetailPage } from "./pages/CertificateDetailPage";
import { AlertsPage } from "./pages/AlertsPage";
import { PerformancePage } from "./pages/PerformancePage";
import { AuditLogPage } from "./pages/AuditLogPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function AppRouter() {
    const location = usePageLocation();
    const [page, ...params] = location.path;

    switch (page) {
    case "":
    case undefined:
        return <DashboardPage />;
    case "agents":
        return params[0]
            ? <AgentDetailPage id={params[0]} />
            : <AgentsPage />;
    case "attestations":
        return <AttestationsPage />;
    case "policies":
        return <PoliciesPage />;
    case "certificates":
        return params[0]
            ? <CertificateDetailPage id={params[0]} />
            : <CertificatesPage />;
    case "alerts":
        return <AlertsPage />;
    case "performance":
        return <PerformancePage />;
    case "audit":
        return <AuditLogPage />;
    case "integrations":
        return <IntegrationsPage />;
    case "settings":
        return <SettingsPage />;
    default:
        return <NotFoundPage />;
    }
}

export function App() {
    const initialize = useCockpitAuth((s) => s.initialize);
    const initialized = useCockpitAuth((s) => s.initialized);
    const autoRefresh = useVisualizationStore((s) => s.autoRefresh);
    const refreshInterval = useVisualizationStore((s) => s.refreshInterval);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (autoRefresh) {
            queryClient.setDefaultOptions({
                queries: {
                    refetchInterval: refreshInterval * 1000,
                },
            });
        } else {
            queryClient.setDefaultOptions({
                queries: {
                    refetchInterval: false,
                },
            });
        }
    }, [autoRefresh, refreshInterval]);

    if (!initialized) {
        return (
            <PageSection variant="default">
                Loading...
            </PageSection>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <Page masthead={<NavigationMenu />}>
                <AppRouter />
            </Page>
        </QueryClientProvider>
    );
}
