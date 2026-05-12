import { Label } from "@patternfly/react-core";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "grey";

const STATE_COLORS: Record<string, BadgeVariant> = {
    registered: "info",
    start: "info",
    saved: "info",
    get_quote: "info",
    provide_v: "success",
    failed: "danger",
    retry: "warning",
    terminated: "grey",
    invalid_quote: "danger",
    tenant_failed: "danger",
    timeout: "warning",
    pass: "success",
    fail: "danger",
    valid: "success",
    expiring_soon: "warning",
    critical: "danger",
    expired: "danger",
    new: "danger",
    acknowledged: "info",
    under_investigation: "warning",
    resolved: "success",
    dismissed: "grey",
    draft: "grey",
    pending_approval: "warning",
    approved: "success",
    applied: "success",
    rejected: "danger",
    up: "success",
    down: "danger",
    high_load: "warning",
};

function mapColor(variant: BadgeVariant): "blue" | "red" | "orange" | "green" | "grey" {
    switch (variant) {
    case "success": return "green";
    case "danger": return "red";
    case "warning": return "orange";
    case "info": return "blue";
    case "grey": return "grey";
    }
}

interface StatusBadgeProps {
    status: string;
    label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
    const variant = STATE_COLORS[status.toLowerCase()] ?? "grey";
    return (
        <Label color={mapColor(variant)}>
            {label ?? status.replace(/_/g, " ")}
        </Label>
    );
}
