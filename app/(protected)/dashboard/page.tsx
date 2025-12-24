import BackupRestore from "@/components/backup-restore";
import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Softech Solutions",
  description: "Main dashboard for Softech Solutions administration",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Home() {
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
