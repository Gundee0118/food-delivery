"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus } from "lucide-react";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  // Хоол нэмэх state
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [foodData, setFoodData] = useState({
    foodName: "",
    image: "",
    ingredients: "",
    price: 0,
  });
  const fetchData = async () => {
    const token = localStorage?.getItem("token");

    try {
      const res = await axios.get(`${API_BASE}/categories`, {
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
        `${API_BASE}/addCategory`,
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
      // Add category дараа жагсаалт дахин татах
      fetchData();
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleAddFood = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE}/addFood`,
        {
          ...foodData,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Хоол амжилттай нэмэгдлээ!");
      setFoodData({
        foodName: "",
        image: "",
        ingredients: "",
        price: 0,
      });
      setFoodDialogOpen(false);
      // Хоол нэмсний дараа хуудас шинэчлэх
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Хоол нэмэхэд алдаа гарлаа!");
    }
  };

  return (
    <div className="bg-white flex flex-col rounded-xl p-6 gap-5 h-fit shadow-sm">
      <h2 className="text-[#09090B] text-[20px] font-semibold">
        Dishes category
      </h2>
      <div className="flex flex-wrap gap-3 min-h-[40px]">
        {categories && Array.isArray(categories) && categories.length > 0 ? (
          categories.map((el) => (
            <Button
              key={el?._id}
              variant={"outline"}
              className="rounded-full border-2 border-gray-200 bg-white text-gray-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 px-4 py-2 h-10"
              onClick={() => {
                setSelectedCategory(el._id);
                setFoodDialogOpen(true);
              }}
            >
              {el?.categoryName}
            </Button>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic">
            Категориуд байхгүй байна.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
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

      {/* Хоол нэмэх Dialog */}
      <Dialog open={foodDialogOpen} onOpenChange={setFoodDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new food</DialogTitle>
            <DialogDescription>
              Add a new dish to the selected category
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="foodName">Food Name</Label>
              <Input
                id="foodName"
                value={foodData.foodName}
                onChange={(e) =>
                  setFoodData({
                    ...foodData,
                    foodName: e.target.value,
                  })
                }
                placeholder="Enter food name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Food Image</Label>
              <CloudinaryUpload
                onImageUpload={(imageUrl) =>
                  setFoodData({
                    ...foodData,
                    image: imageUrl,
                  })
                }
                currentImage={foodData.image}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={foodData.ingredients}
                onChange={(e) =>
                  setFoodData({
                    ...foodData,
                    ingredients: e.target.value,
                  })
                }
                placeholder="Enter ingredients"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={foodData.price || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFoodData({
                      ...foodData,
                      price: value === "" ? 0 : parseFloat(value),
                    });
                  }}
                  placeholder="0.00"
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  $
                </span>
              </div>
              <p className="text-xs text-gray-500">Жишээ: 15000, 25000.50</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddFood}>Add Food</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
