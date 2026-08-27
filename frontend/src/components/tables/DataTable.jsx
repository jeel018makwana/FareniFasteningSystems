import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import DataTableEmpty from "./DataTableEmpty";
import DataTableLoading from "./DataTableLoading";

export default function DataTable({
  columns,
  data,
  loading,
}) {

    const table = useReactTable({
        data,
        columns,

        getCoreRowModel: getCoreRowModel(),
        });

    if (loading) {
        return (
            <DataTableLoading
            rows={8}
            columns={columns.length}
            />
        );
        }

    if (!data.length) {
        return (
            <DataTableEmpty
            title="No records found"
            description="Try changing your search or add a new record."
            />
        );
    }

    return (
        <div className="space-y-4">

            <div className="rounded-xl border bg-card">
            <Table>
                <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                        {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                        </TableHead>
                    ))}
                    </TableRow>
                ))}
                </TableHeader>

                <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {cell.column.columnDef.cell
                                ? flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                            ): cell.getValue()
                        }
                        </TableCell>
                    ))}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}