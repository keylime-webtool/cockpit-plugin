import {
    Card, CardTitle, CardBody,
} from "@patternfly/react-core";

interface KpiCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
}

export function KpiCard({ title, value, subtitle }: KpiCardProps) {
    return (
        <Card isCompact>
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
