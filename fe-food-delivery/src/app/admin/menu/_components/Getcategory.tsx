"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
type categoryType = {
  _id: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
};
export const GetCategory = () => {
  const [categories, setCategories] = useState<categoryType[]>([]);

  const [open, setOpen] = useState(false);
  const [addCategory, setAddCategory] = useState("");
  const fetchData = async () => {
    const token = localStorage?.getItem("token");

    try {
      const res = await axios.get("http://localhost:8000/Categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      } else {
        console.error("Invalid data format:", res.data);
      }

      //   setCategories(res.data.category);
      //   console.log(res.data);
      //   setCategories(res.data.categories);
    } catch (err) {
      console.log(err, "errrrr");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  const HandleAddcategory = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:8000/addCategory",
        { categoryName: addCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   console.log(res.data, "qdjqlwjdikhdlhqliwuq");
      setCategories((prev) => [...prev, res.data.categories]);
      setAddCategory("");
      setOpen(false);
    } catch (err) {
      console.log(err, "err");
    }
  };

  return (
    <div className="bg-white flex flex-col rounded-xl p-6 gap-5 h-fit">
      <h2 className="text-[#09090B] text-[20px]">Dishes category</h2>
      <div className="flex flex-wrap h-[36px] w-fit gap-4">
        {categories && Array.isArray(categories) && categories.length > 0 ? (
          categories.map((el) => (
            <div className="" key={el?._id}>
              <Button
                variant={"ghost"}
                className="rounded-full border border-[#E4E4E7] bg-white text-[#18181B] variant-outline hover:border-red-500"
              >
                {el?.categoryName}
              </Button>
            </div>
          ))
        ) : (
          <div>Категориуд байхгүй байна.</div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-[36px] rounded-full w-[36px]"
            >
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new category</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="addCategory">Category name</Label>
                <Input
                  id="addCategory"
                  name="name"
                  placeholder="category"
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                />
              </div>
              <div className="grid gap-3"></div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={HandleAddcategory}>Add category</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};
