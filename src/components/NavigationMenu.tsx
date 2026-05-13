import cockpit from "cockpit";
import { Nav, NavItem, NavList, Label } from "@patternfly/react-core";
import { useQuery } from "@tanstack/react-query";
import { usePageLocation } from "../hooks/usePageLocation";
import { performanceApi } from "../api/performance";

interface NavEntry {
    path: string;
    label: string;
}

const NAV_ITEMS: NavEntry[] = [
    { path: "", label: "Dashboard" },
    { path: "agents", label: "Agents" },
    { path: "attestations", label: "Attestations" },
    { path: "policies", label: "Policies" },
    { path: "certificates", label: "Certificates" },
    { path: "alerts", label: "Alerts" },
    { path: "performance", label: "Performance" },
    { path: "audit", label: "Audit Log" },
    { path: "integrations", label: "Integrations" },
    { path: "settings", label: "Settings" },
];

interface IntegrationResult {
    services: import("../types").IntegrationService[];
    backendLatencyMs: number;
}

function useConnectivityIssueCount(): number {
    const { data, isError: backendDown } = useQuery<IntegrationResult>({
        queryKey: ["integrations", "status"],
        queryFn: async () => {
            const start = performance.now();
            const services = await performanceApi.getIntegrationStatus();
            const backendLatencyMs = Math.round(performance.now() - start);
            return { services, backendLatencyMs };
        },
        refetchInterval: 30_000,
        retry: false,
    });

    if (backendDown) return 1;
    if (!data) return 0;
    return data.services.filter((s) => s.status.toLowerCase() !== "up").length;
}

export function NavigationMenu() {
    const location = usePageLocation();
    const currentPage = location.path[0] ?? "";
    const issueCount = useConnectivityIssueCount();

    return (
        <Nav>
            <NavList>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.path}
                        isActive={currentPage === item.path}
                        onClick={() => cockpit.location.go([item.path])}
                    >
                        {item.label}
                        {item.path === "integrations" && issueCount > 0 && (
                            <Label color="red" isCompact style={{ marginLeft: 8 }}>
                                {issueCount}
                            </Label>
                        )}
                    </NavItem>
                ))}
            </NavList>
        </Nav>
    );
}
