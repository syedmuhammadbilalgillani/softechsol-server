import React from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const CompaniesForm = ({ className }: { className?: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className, "w-full")}>
          Create Company
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default CompaniesForm;
