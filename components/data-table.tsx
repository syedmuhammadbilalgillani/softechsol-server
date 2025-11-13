import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Column<T> {
  label: string;
  key: keyof T | string;
  render?: (row: T) => React.ReactNode;
  columnClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  className?: string;
}

const DataTable = <T,>({
  columns,
  data,
  loading,
  className,
}: DataTableProps<T>) => {
  const renderSkeletonRows = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {columns.map((col: any) => (
            <TableCell
              key={`skeleton-${col.key}-${index}`}
              className={col.columnClassName}
            >
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ));
  };

  return (
    <div
      className={cn(
        "border rounded-md px-2 py-2 overflow-auto",
        "bg-white dark:bg-sidebar",
        "text-gray-800 dark:text-gray-100",
        "scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800",
        className
      )}
    >
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-background">
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className={cn(
                  col.columnClassName,
                  "max-w-10 truncate text-gray-700 dark:text-gray-300"
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            renderSkeletonRows()
          ) : data.length > 0 ? (
            data.map((row: any, index: any) => (
              <TableRow
                key={row.id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${String(col.key)}-${index}`}
                    className={cn(
                      col.columnClassName,
                      "max-w-[100px] overflow-hidden truncate"
                    )}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-4 text-gray-500 dark:text-gray-400"
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default DataTable;
