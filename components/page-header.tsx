// components/ui/page-header.tsx

import React from "react";

interface PageHeaderProps {
  heading: string;
  paragraph?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ heading, paragraph }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
      {paragraph && (
        <p className="text-muted-foreground text-sm mt-1">{paragraph}</p>
      )}
    </div>
  );
};

