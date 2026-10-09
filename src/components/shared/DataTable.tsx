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
    <div className="w-full overflow-hidden border rounded-lg shadow-xs bg-card">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/70 text-muted-foreground uppercase text-[10px] sm:text-xs">
            <tr>
              {columns.map((col) => (
                <th key={String(col.accessorKey)} className="px-3 sm:px-4 py-3 whitespace-nowrap font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.accessorKey)} className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      {String(row[col.accessorKey])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}