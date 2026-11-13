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
import {
  Download,
  Upload,
  Loader2,
  Database,
  AlertCircle,
  CheckCircle2,
  Archive,
  FileCode,
  FolderArchive,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function BackupRestore() {
  const [exportLoading, setExportLoading] = useState<"zip" | "json" | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleExport = async (format: "zip" | "json" = "zip") => {
    setExportLoading(format);
    setImportResult(null);

    try {
      const response = await fetch(`/api/backup?format=${format}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Export failed");
      }

      // Get the filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = format === "zip" ? "full-backup.zip" : "db-backup.json";
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

      toast.success(
        format === "zip"
          ? "Full Backup (DB + Assets) exported successfully!"
          : "Database JSON exported successfully!",
        {
          description: `Downloaded: ${filename}`,
        }
      );
    } catch (error: any) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: error.message || "Failed to export backup",
      });
    } finally {
      setExportLoading(null);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isZip = file.name.endsWith(".zip");
    const isJson = file.name.endsWith(".json");

    if (!isZip && !isJson) {
      toast.error("Invalid file type", {
        description: "Please select a .zip (full backup with assets) or .json backup file",
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      "⚠️ WARNING: This will overwrite or restore existing data in the database!\n\n" +
        (isZip ? "Uploaded assets will be extracted into public/storage/.\n\n" : "") +
        "Are you sure you want to proceed?"
    );

    if (!confirmed) {
      event.target.value = "";
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/backup", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Import failed");
      }

      setImportResult({
        success: true,
        message: result.message || "Backup imported successfully",
        details: result,
      });

      toast.success("Backup import completed!", {
        description: `Imported ${result.totalCreated || 0} records${
          result.assetsExtracted ? ` & extracted ${result.assetsExtracted} assets` : ""
        }`,
        duration: 6000,
      });

      event.target.value = "";
    } catch (error: any) {
      console.error("Import error:", error);
      setImportResult({
        success: false,
        message: error.message || "Failed to import backup",
      });
      toast.error("Import failed", {
        description: error.message || "Failed to import backup",
        duration: 6000,
      });
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-primary" />
              <CardTitle>Export Complete Backup</CardTitle>
            </div>
            <CardDescription>
              Export your entire database along with uploaded images and files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <FolderArchive className="size-4 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Complete Migration Bundle (.zip)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Includes all database tables plus all physical images/assets from{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">public/storage</code>.
                    Best for website migration!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2 border-t border-border">
                <FileCode className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Database Only (.json)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Exports only database records in structured JSON format without images.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleExport("zip")}
                disabled={exportLoading !== null}
                className="flex-1"
                size="lg"
              >
                {exportLoading === "zip" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Packaging Zip...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Full Backup (.zip)
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleExport("json")}
                disabled={exportLoading !== null}
                variant="outline"
                size="lg"
              >
                {exportLoading === "json" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    DB Only (.json)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              <CardTitle>Import Backup & Migrate</CardTitle>
            </div>
            <CardDescription>
              Restore database and extract uploaded assets from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-amber-300/60 bg-amber-50/60 dark:bg-amber-950/20 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Supports .zip & .json formats
                  </p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1">
                    Uploading a <strong>.zip</strong> bundle will extract all images into storage and
                    restore all database tables. Make sure you have a current backup before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="file"
                accept=".zip,.json"
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
                  className="w-full cursor-pointer hover:bg-accent"
                  size="lg"
                >
                  <span>
                    {importLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing & Extracting...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select Backup (.zip or .json)
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {importResult.success ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Import & Migration Results
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
            <Alert variant={importResult.success ? "default" : "destructive"}>
              <AlertTitle>{importResult.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>{importResult.message}</p>

                {importResult.success && importResult.details && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-background/80 border p-3">
                        <span className="text-xs text-muted-foreground">Total Database Records</span>
                        <p className="text-xl font-bold text-foreground">
                          {importResult.details.totalCreated || 0}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background/80 border p-3">
                        <span className="text-xs text-muted-foreground">Assets Extracted to Storage</span>
                        <p className="text-xl font-bold text-foreground">
                          {importResult.details.assetsExtracted || 0}
                        </p>
                      </div>
                    </div>

                    {importResult.details.created && (
                      <div className="rounded-lg bg-muted/60 p-3">
                        <p className="text-xs font-semibold text-foreground mb-2">Imported Models Breakdown:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {Object.entries(importResult.details.created).map(([model, count]) => (
                            <div key={model} className="flex justify-between border-b pb-1">
                              <span className="text-muted-foreground">{model}:</span>
                              <span className="font-mono font-medium">{String(count)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {importResult.details.errors && importResult.details.errors.length > 0 && (
                      <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
                        <p className="font-semibold mb-1">Warnings ({importResult.details.errors.length}):</p>
                        <ul className="list-disc list-inside max-h-32 overflow-y-auto space-y-1">
                          {importResult.details.errors.slice(0, 10).map((err: string, i: number) => (
                            <li key={i}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
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
