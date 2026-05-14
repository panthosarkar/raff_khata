"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TransactionDeleteDialogProps {
  transactionId?: string;
  compact?: boolean;
}

export function TransactionDeleteDialog({
  transactionId,
  compact = false,
}: TransactionDeleteDialogProps) {
  const { deleteTransaction } = useTransactions();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!transactionId) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTransaction(transactionId);
    setDeleting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <button
            type="button"
            className="flex-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-200 transition hover:border-rose-500/50 hover:bg-rose-500/20"
          >
            Delete
          </button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="px-4"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete transaction?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The transaction will be removed
            permanently.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
