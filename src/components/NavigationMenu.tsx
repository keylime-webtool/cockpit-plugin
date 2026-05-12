import cockpit from "cockpit";
import { Nav, NavItem, NavList } from "@patternfly/react-core";
import { usePageLocation } from "../hooks/usePageLocation";

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

export function NavigationMenu() {
    const location = usePageLocation();
    const currentPage = location.path[0] ?? "";

    return (
        <Nav variant="horizontal">
            <NavList>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.path}
                        isActive={currentPage === item.path}
                        onClick={() => cockpit.location.go([item.path])}
                    >
                        {item.label}
                    </NavItem>
                ))}
            </NavList>
        </Nav>
    );
}
