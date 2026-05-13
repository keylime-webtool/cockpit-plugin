import cockpit from "cockpit";
import {
    Card, CardTitle, CardBody,
} from "@patternfly/react-core";

type KpiVariant = "default" | "success" | "warning" | "danger";

const VARIANT_COLORS: Record<KpiVariant, string | undefined> = {
    default: undefined,
    success: "var(--pf-t--global--color--status--success--default)",
    warning: "var(--pf-t--global--color--status--warning--default)",
    danger: "var(--pf-t--global--color--status--danger--default)",
};

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    variant?: KpiVariant;
    linkTo?: string;
}

export function KpiCard({ title, value, subtitle, variant = "default", linkTo }: KpiCardProps) {
    const handleClick = linkTo ? () => cockpit.location.go([linkTo]) : undefined;
    const borderColor = VARIANT_COLORS[variant];
    const cardStyle: React.CSSProperties = {
        ...(linkTo ? { cursor: "pointer" } : {}),
        ...(borderColor ? { borderLeft: `4px solid ${borderColor}` } : {}),
    };

    return (
        <Card
            isCompact
            isClickable={!!linkTo}
            isSelectable={!!linkTo}
            onClick={handleClick}
            style={cardStyle}
        >
            <CardTitle>{title}</CardTitle>
            <CardBody>
                <div style={{ fontSize: "var(--pf-t--global--font--size--heading--2xl)", fontWeight: "bold" }}>
                    {value}
                </div>
                {subtitle && (
                    <div style={{ color: "var(--pf-t--global--color--nonstatus--gray--default)" }}>
                        {subtitle}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
