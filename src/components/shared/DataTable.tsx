interface Column<T> {
  header: string;
  accessorKey: keyof T;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessorKey)} className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-muted/50">
                {columns.map((col) => (
                  <td key={String(col.accessorKey)} className="px-4 py-3">
                    {String(row[col.accessorKey])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-muted-foreground"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
