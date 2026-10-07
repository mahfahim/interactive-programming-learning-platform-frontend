import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  User,
  Shield,
  Clock,
  ArrowUpDown,
  FileText,
  Globe,
  Terminal,
} from "lucide-react";

// Types matching your setup
import type { IAuditLogFilterQuery } from "@/types";
import { useAuditLogs } from "@/hooks/auditLog.hook";

// UI Component primitives (shadcn/ui style)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

// Interface for Audit Log record returned from API
export interface AuditLogRecord {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  actorId?: string | null;
  actor?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  requestId?: string | null;
  createdAt: string;
}

const ACTION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CREATE: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/20" },
  UPDATE: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/20" },
  DELETE: { bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-500/20" },
  READ: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/20" },
  LOGIN: { bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-500/20" },
  LOGOUT: { bg: "bg-slate-500/10", text: "text-slate-700 dark:text-slate-400", border: "border-slate-500/20" },
};

const SKELETON_ROWS = ["skel-1", "skel-2", "skel-3", "skel-4", "skel-5"];

function ActionBadge({ action }: { action: string }) {
  const style = ACTION_COLORS[action] || {
    bg: "bg-slate-500/10",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-500/20",
  };

  return (
    <Badge variant="outline" className={`${style.bg} ${style.text} ${style.border} font-semibold px-2.5 py-0.5 rounded-md`}>
      {action}
    </Badge>
  );
}

function JsonViewer({ title, data }: { title: string; data?: Record<string, unknown> | null }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 p-3">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      {data && Object.keys(data).length > 0 ? (
        <pre className="max-h-60 overflow-auto rounded bg-background p-3 text-xs font-mono text-foreground border">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-xs italic text-muted-foreground py-2">No {title.toLowerCase()} recorded</p>
      )}
    </div>
  );
}

export function AuditLogsTable() {
  const [filters, setFilters] = useState<IAuditLogFilterQuery>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedLog, setSelectedLog] = useState<AuditLogRecord | null>(null);

  const { data: response, isLoading, isError, refetch } = useAuditLogs(filters);

  const logs: AuditLogRecord[] = Array.isArray(response?.data)
    ? (response.data as AuditLogRecord[])
    : [];

  const meta = response?.meta || { page: 1, limit: 20, total: 0, totalPages: 1 };

  const handleFilterChange = (key: keyof IAuditLogFilterQuery, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: key === "page" ? (value as number) : 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground">
            Track, inspect, and audit all system operations and user activities.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="self-start sm:self-auto gap-2">
          <RotateCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            {/* Entity Type Input */}
            <div className="space-y-1.5">
              <label htmlFor="filter-entity-type" className="text-xs font-medium text-muted-foreground">
                Entity Type
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filter-entity-type"
                  placeholder="e.g. User, Order"
                  value={filters.entityType || ""}
                  onChange={(e) => handleFilterChange("entityType", e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>
            </div>

            {/* Entity ID Input */}
            <div className="space-y-1.5">
              <label htmlFor="filter-entity-id" className="text-xs font-medium text-muted-foreground">
                Entity ID
              </label>
              <Input
                id="filter-entity-id"
                placeholder="Target entity ID"
                value={filters.entityId || ""}
                onChange={(e) => handleFilterChange("entityId", e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Action Select */}
            <div className="space-y-1.5">
              <label htmlFor="filter-action" className="text-xs font-medium text-muted-foreground">
                Action
              </label>
              <Select
                value={filters.action || "ALL"}
                onValueChange={(val) => handleFilterChange("action", val === "ALL" ? undefined : val)}
              >
                <SelectTrigger id="filter-action" className="h-9 text-xs">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Actions</SelectItem>
                  <SelectItem value="CREATE">CREATE</SelectItem>
                  <SelectItem value="UPDATE">UPDATE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="READ">READ</SelectItem>
                  <SelectItem value="LOGIN">LOGIN</SelectItem>
                  <SelectItem value="LOGOUT">LOGOUT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actor ID Input */}
            <div className="space-y-1.5">
              <label htmlFor="filter-actor-id" className="text-xs font-medium text-muted-foreground">
                Actor ID
              </label>
              <Input
                id="filter-actor-id"
                placeholder="User UUID"
                value={filters.actorId || ""}
                onChange={(e) => handleFilterChange("actorId", e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* Start Date Input */}
            <div className="space-y-1.5">
              <label htmlFor="filter-start-date" className="text-xs font-medium text-muted-foreground">
                Start Date
              </label>
              <Input
                id="filter-start-date"
                type="date"
                value={filters.startDate || ""}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* End Date Input */}
            <div className="space-y-1.5">
              <label htmlFor="filter-end-date" className="text-xs font-medium text-muted-foreground">
                End Date
              </label>
              <Input
                id="filter-end-date"
                type="date"
                value={filters.endDate || ""}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSortOrder}
                className="h-8 text-xs gap-1.5 text-muted-foreground"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort: {filters.sortBy} ({filters.sortOrder?.toUpperCase()})
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetFilters} className="h-8 text-xs gap-1 text-muted-foreground">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-45">Timestamp</TableHead>
              <TableHead className="w-30">Action</TableHead>
              <TableHead className="w-35">Entity</TableHead>
              <TableHead className="w-50">Actor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-20 text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((key) => (
                <TableRow key={key}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-destructive">
                  Failed to load audit logs. Please try again.
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No audit logs found matching the selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                      {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ActionBadge action={log.action} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-foreground">{log.entityType}</span>
                      {log.entityId && (
                        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-30">
                          ID: {log.entityId}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.actor ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">{log.actor.name}</span>
                        <span className="text-[10px] text-muted-foreground">{log.actor.email}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">System / Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-foreground max-w-xs truncate">
                    {log.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLog(log)}
                      className="h-8 w-8 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <label htmlFor="rows-per-page-select" className="sr-only">Rows per page</label>
            <span>Rows per page:</span>
            <Select
              value={String(filters.limit || 20)}
              onValueChange={(val) => handleFilterChange("limit", Number(val))}
            >
              <SelectTrigger id="rows-per-page-select" className="h-8 w-17.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="hidden sm:inline">
              Showing {logs.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0} to{" "}
              {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              Page {meta.page} of {meta.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={meta.page <= 1 || isLoading}
              onClick={() => handleFilterChange("page", meta.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={meta.page >= meta.totalPages || isLoading}
              onClick={() => handleFilterChange("page", meta.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <ActionBadge action={selectedLog.action} />
                <DialogTitle className="text-lg font-bold">
                  {selectedLog.entityType} Log Detail
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Log ID: <span className="font-mono">{selectedLog.id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* General Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-lg border bg-muted/20 p-4">
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> Actor
                  </span>
                  <p className="text-xs font-semibold mt-1">
                    {selectedLog.actor?.name || "System"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedLog.actor?.email || selectedLog.actorId || "N/A"}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Created At
                  </span>
                  <p className="text-xs font-semibold mt-1">
                    {format(new Date(selectedLog.createdAt), "yyyy-MM-dd HH:mm:ss")}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Network
                  </span>
                  <p className="text-xs font-semibold mt-1 font-mono">
                    IP: {selectedLog.ipAddress || "N/A"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Description</span>
                <p className="text-sm rounded-md bg-muted/30 border p-3 text-foreground">
                  {selectedLog.description}
                </p>
              </div>

              {/* Tabs for Diffs and Metadata */}
              <Tabs defaultValue="diff" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="diff" className="text-xs gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> State Changes (Diff)
                  </TabsTrigger>
                  <TabsTrigger value="metadata" className="text-xs gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> Context & Metadata
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diff" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <JsonViewer title="Old Values" data={selectedLog.oldValues} />
                    <JsonViewer title="New Values" data={selectedLog.newValues} />
                  </div>
                </TabsContent>

                <TabsContent value="metadata" className="mt-4 space-y-4">
                  <JsonViewer title="Metadata" data={selectedLog.metadata} />

                  <div className="space-y-2 rounded-lg border p-3 bg-muted/20 text-xs">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground font-medium">Request ID</span>
                      <span className="font-mono text-foreground">{selectedLog.requestId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground font-medium">User Agent</span>
                      <span className="font-mono text-foreground truncate max-w-sm" title={selectedLog.userAgent || ""}>
                        {selectedLog.userAgent || "N/A"}
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}