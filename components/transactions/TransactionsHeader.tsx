"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  Download,
  FolderPlus,
  Plus,
  Trash2,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function TransactionsHeader() {
  const {
    showForm,
    setShowForm,
    handleExportCsv,
    openCreateForm,
    folders,
    foldersLoading,
    selectedFolder,
    setSelectedFolder,
    createFolder,
    deleteFolder,
  } = useTransactions();

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = async () => {
    const name = folderName.trim();
    if (!name) return;
    await createFolder(name);
    setFolderName("");
    setFolderDialogOpen(false);
  };

  const handleDeleteSelectedFolder = async () => {
    if (!selectedFolder) return;
    if (window.confirm(`Delete folder "${selectedFolder.name}"?`)) {
      await deleteFolder(selectedFolder.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[rgba(0,238,255,0.9)]">
          TRANSACTION LOG
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Transactions
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-[rgba(243,251,255,0.7)] md:text-base">
          Track income, spending, and folder-based transaction groups with a
          cleaner workflow.
        </p>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="justify-between gap-3 px-5"
              >
                <span className="flex items-center gap-2">
                  <FolderPlus className="h-4 w-4" />
                  {selectedFolder?.name || "All folders"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel>Folder filters</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setSelectedFolder(null)}>
                All folders
                {!selectedFolder && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {foldersLoading ? (
                <DropdownMenuItem disabled>Loading folders...</DropdownMenuItem>
              ) : folders.length ? (
                folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onSelect={() => setSelectedFolder(folder)}
                  >
                    {folder.name}
                    {selectedFolder?.id === folder.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>No folders yet</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 px-5">
                <Plus className="h-4 w-4" />
                New folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a folder</DialogTitle>
                <DialogDescription>
                  Organize transactions into named groups like family, business,
                  or savings.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={folderName}
                  onChange={(event) => setFolderName(event.target.value)}
                  placeholder="Folder name"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setFolderDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleCreateFolder}>
                    Create folder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {selectedFolder && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteSelectedFolder}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete folder
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportCsv}
            className="gap-2 px-5"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            type="button"
            onClick={showForm ? () => setShowForm(false) : openCreateForm}
            className="gap-2 px-5"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close form" : "Add transaction"}
          </Button>
        </div>
      </div>
    </div>
  );
}
