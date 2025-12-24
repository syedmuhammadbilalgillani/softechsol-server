import { PageHeader } from "@/components/page-header";
import BackupRestore from "@/components/backup-restore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Database Backup & Restore - Softech Solutions",
  description: "Export and import complete database backups",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BackupPage() {
  return (
    <div className="p-5">
      <PageHeader
        heading="Database Backup & Restore"
        paragraph="Export your database as a backup file or restore from a previous backup"
      />
      <div className="mt-4">
        <BackupRestore />
      </div>
    </div>
  );
}
