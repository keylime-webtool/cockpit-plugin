import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable, type ColumnDef } from "../DataTable";

interface TestItem {
    id: string;
    name: string;
    status: string;
}

const columns: ColumnDef<TestItem>[] = [
    { key: "name", title: "Name", render: (item) => item.name },
    { key: "status", title: "Status", render: (item) => item.status },
];

const items: TestItem[] = [
    { id: "1", name: "Agent Alpha", status: "active" },
    { id: "2", name: "Agent Beta", status: "inactive" },
];

describe("DataTable", () => {
    it("renders column headers", () => {
        render(
            <DataTable
                columns={columns}
                items={items}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders row data", () => {
        render(
            <DataTable
                columns={columns}
                items={items}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.getByText("Agent Alpha")).toBeInTheDocument();
        expect(screen.getByText("Agent Beta")).toBeInTheDocument();
        expect(screen.getByText("active")).toBeInTheDocument();
        expect(screen.getByText("inactive")).toBeInTheDocument();
    });

    it("renders empty table when no items", () => {
        render(
            <DataTable
                columns={columns}
                items={[]}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.queryByText("Agent Alpha")).toBeNull();
    });

    it("shows pagination when totalItems is provided", () => {
        const onPageChange = vi.fn();
        render(
            <DataTable
                columns={columns}
                items={items}
                totalItems={50}
                page={1}
                pageSize={25}
                onPageChange={onPageChange}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.getByLabelText(/current page/i)).toBeInTheDocument();
    });

    it("hides pagination when totalItems is not provided", () => {
        render(
            <DataTable
                columns={columns}
                items={items}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.queryByLabelText(/current page/i)).toBeNull();
    });

    it("renders custom cell content via render function", () => {
        const customColumns: ColumnDef<TestItem>[] = [
            {
                key: "name",
                title: "Agent",
                render: (item) => `[${item.name}]`,
            },
        ];
        render(
            <DataTable
                columns={customColumns}
                items={[items[0]]}
                keyExtractor={(i) => i.id}
            />,
        );
        expect(screen.getByText("[Agent Alpha]")).toBeInTheDocument();
    });
});
