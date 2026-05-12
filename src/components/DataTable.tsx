import {
    Table, Thead, Tbody, Tr, Th, Td,
} from "@patternfly/react-table";
import { Pagination } from "@patternfly/react-core";
import { useState, type ReactNode } from "react";

export interface ColumnDef<T> {
    key: string;
    title: string;
    render: (item: T) => ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    columns: ColumnDef<T>[];
    items: T[];
    totalItems?: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    keyExtractor: (item: T) => string;
}

export function DataTable<T>({
    columns,
    items,
    totalItems,
    page = 1,
    pageSize = 25,
    onPageChange,
    onPageSizeChange,
    keyExtractor,
}: DataTableProps<T>) {
    const [activeSortIndex, setActiveSortIndex] = useState<number | undefined>(undefined);
    const [activeSortDirection, setActiveSortDirection] = useState<"asc" | "desc">("asc");

    const hasPagination = totalItems !== undefined && onPageChange;

    return (
        <>
            <Table variant="compact">
                <Thead>
                    <Tr>
                        {columns.map((col, index) => (
                            <Th
                                key={col.key}
                                sort={col.sortable ? {
                                    sortBy: {
                                        index: activeSortIndex,
                                        direction: activeSortDirection,
                                    },
                                    onSort: (_event, idx, direction) => {
                                        setActiveSortIndex(idx);
                                        setActiveSortDirection(direction);
                                    },
                                    columnIndex: index,
                                } : undefined}
                            >
                                {col.title}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item) => (
                        <Tr key={keyExtractor(item)}>
                            {columns.map((col) => (
                                <Td key={col.key}>
                                    {col.render(item)}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {hasPagination && (
                <Pagination
                    itemCount={totalItems}
                    perPage={pageSize}
                    page={page}
                    onSetPage={(_event, newPage) => onPageChange(newPage)}
                    onPerPageSelect={(_event, newSize) => onPageSizeChange?.(newSize)}
                />
            )}
        </>
    );
}
