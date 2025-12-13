"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Upload, Loader2, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function BackupRestore() {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleExport = async () => {
    setExportLoading(true);
    setImportResult(null);

    try {
      const response = await fetch("/api/backup", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Export failed");
      }

      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "db-backup.json";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Convert response to blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Database backup exported successfully!", {
        description: `File downloaded: ${filename}`,
      });
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: error.message || "Failed to export database backup",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json")) {
      toast.error("Invalid file type", {
        description: "Please select a JSON backup file",
      });
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    try {
      // Read file content
      const fileContent = await file.text();
      let backupData;

      try {
        backupData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new Error("Invalid JSON file format");
      }

      // Validate backup data structure
      if (!backupData || !backupData.data) {
        throw new Error("Invalid backup file format. Missing data structure.");
      }

      // Show confirmation dialog
      const confirmed = window.confirm(
        "⚠️ WARNING: This will replace ALL existing data in the database!\n\n" +
          "This action cannot be undone. Are you sure you want to continue?"
      );

      if (!confirmed) {
        setImportLoading(false);
        return;
      }

      // Send import request
      const response = await fetch("/api/backup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backupData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Import failed");
      }

      setImportResult({
        success: true,
        message: result.message || "Database imported successfully",
        details: result,
      });

      toast.success("Database import completed!", {
        description: `Imported ${result.totalCreated || 0} records`,
        duration: 5000,
      });

      // Reset file input
      event.target.value = "";
    } catch (error: any) {
      console.error("Import error:", error);
      setImportResult({
        success: false,
        message: error.message || "Failed to import database backup",
      });
      toast.error("Import failed", {
        description: error.message || "Failed to import database backup",
        duration: 5000,
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Export Database</CardTitle>
            </div>
            <CardDescription>
              Download a complete backup of your database as a JSON file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                This will export all data including:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Users, Blogs, Categories</li>
                <li>Projects, Services, Teams</li>
                <li>Jobs, Podcasts, Gallery Items</li>
                <li>All relationships and metadata</li>
              </ul>
            </div>
            <Button
              onClick={handleExport}
              disabled={exportLoading}
              className="w-full"
              size="lg"
            >
              {exportLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <CardTitle>Import Database</CardTitle>
            </div>
            <CardDescription>
              Restore your database from a previously exported backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Warning: Destructive Operation
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This will replace ALL existing data. Make sure you have a
                    backup before proceeding.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importLoading}
                className="hidden"
                id="backup-file-input"
              />
              <label htmlFor="backup-file-input">
                <Button
                  asChild
                  variant="outline"
                  disabled={importLoading}
                  className="w-full"
                  size="lg"
                >
                  <span>
                    {importLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Backup File
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Import Results
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Import Failed
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert
              variant={importResult.success ? "default" : "destructive"}
            >
              <AlertTitle>
                {importResult.success ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">{importResult.message}</p>
                {importResult.success && importResult.details && (
                  <div className="mt-4 space-y-2">
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm font-medium mb-2">
                        Import Statistics:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Total Records:
                          </span>{" "}
                          <span className="font-medium">
                            {importResult.details.totalCreated || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Duration:
                          </span>{" "}
                          <span className="font-medium">
                            {importResult.details.duration || "N/A"}
                          </span>
                        </div>
                      </div>
                      {importResult.details.created && (
                        <div className="mt-3">
                          <p className="text-xs font-medium mb-1">
                            Records by Type:
                          </p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {Object.entries(importResult.details.created).map(
                              ([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}:
                                  </span>
                                  <span className="font-medium">{value as number}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                      {importResult.details.errors &&
                        importResult.details.errors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-destructive mb-1">
                              Errors ({importResult.details.errors.length}):
                            </p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {importResult.details.errors
                                .slice(0, 10)
                                .map((error: string, idx: number) => (
                                  <p
                                    key={idx}
                                    className="text-xs text-destructive"
                                  >
                                    • {error}
                                  </p>
                                ))}
                              {importResult.details.errors.length > 10 && (
                                <p className="text-xs text-muted-foreground">
                                  ... and{" "}
                                  {importResult.details.errors.length - 10} more
                                  errors
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
