"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus } from "lucide-react";
import api from "@/lib/api";

interface Props {
  onAdd: (category: { _id: string; name: string }) => void;
  trigger?: React.ReactNode;
}

export default function AddCategoryDialog({ onAdd, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!categoryName.trim()) return;
    try {
      setLoading(true);
      const res = await api.post("/addCategory", { name: categoryName });
      onAdd(res.data.category);

      setCategoryName("");
      setOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" className="flex gap-1 items-center">
            <Plus className="w-4 h-4" />
            Add category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
        </DialogHeader>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Type category name..."
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleAdd}
            disabled={loading || !categoryName.trim()}
          >
            {loading ? "Saving..." : "Add category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
