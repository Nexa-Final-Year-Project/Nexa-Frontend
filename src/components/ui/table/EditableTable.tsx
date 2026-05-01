"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Column<T> {
  header: string;
  accessor: keyof T | string; // allow string for nested keys like "owner.email"
  editable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface EditableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onChange?: (updatedData: T[]) => void;
  loading?: boolean;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export function EditableTable<T extends { id?: string | number; _id?: string | number }>({
  columns,
  data,
  onChange,
  loading = false,
}: EditableTableProps<T>) {
  const [tableData, setTableData] = React.useState<T[]>(data);

  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleCellChange = (
    rowIndex: number,
    accessor: keyof T | string,
    value: any,
  ) => {
    const updated = [...tableData];
    const accessorStr = accessor as string;

    if (accessorStr.includes(".")) {
      const keys = accessorStr.split(".");
      let temp: any = { ...updated[rowIndex] };
      let ref = temp;
      for (let i = 0; i < keys.length - 1; i++) {
        ref[keys[i]] = { ...ref[keys[i]] };
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      updated[rowIndex] = temp;
    } else {
      updated[rowIndex] = { ...updated[rowIndex], [accessor]: value };
    }

    setTableData(updated);
    onChange?.(updated);
  };

  return (
    <Table className="w-full table-auto min-w-[720px]">
      <TableHeader>
        <TableRow>
          {columns.map((col, columnIndex) => (
            <TableHead
              key={`header-${columnIndex}-${String(col.accessor ?? col.header)}`}
              style={{ width: col.width || "auto" }}
              className="px-2 py-1 text-sm text-left"
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : tableData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        ) : (
          tableData.map((row, rowIndex) => (
            <TableRow key={String(row._id ?? row.id ?? rowIndex)}>
              {columns.map((col, columnIndex) => (
                <TableCell
                  key={`cell-${rowIndex}-${columnIndex}-${String(col.accessor ?? col.header)}`}
                  style={{ width: col.width || "auto" }}
                  className="px-2 py-1 text-sm align-middle whitespace-normal break-words"
                >
                  {col.render ? (
                    col.render(row)
                  ) : col.editable ? (
                    <Input
                      className="h-8 py-0 px-2 text-sm w-full"
                      value={String(
                        getNestedValue(row, col.accessor as string) ?? "",
                      )}
                      onChange={(e) =>
                        handleCellChange(rowIndex, col.accessor, e.target.value)
                      }
                    />
                  ) : (
                    <span>
                      {String(
                        getNestedValue(row, col.accessor as string) ?? "",
                      )}
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
