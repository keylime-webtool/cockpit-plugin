import cockpit from "cockpit";
import {
    Card, CardTitle, CardBody,
} from "@patternfly/react-core";

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    linkTo?: string;
}

export function KpiCard({ title, value, subtitle, linkTo }: KpiCardProps) {
    const handleClick = linkTo ? () => cockpit.location.go([linkTo]) : undefined;

    return (
        <Card
            isCompact
            isClickable={!!linkTo}
            isSelectable={!!linkTo}
            onClick={handleClick}
            style={linkTo ? { cursor: "pointer" } : undefined}
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
