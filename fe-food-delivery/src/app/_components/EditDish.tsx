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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import { Pen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface EditDishProps {
  food: {
    _id: string;
    foodName: string;
    image: string;
    ingredients: string;
    price: number;
    category: string;
  };
  onUpdate: () => void;
}

export function EditDish({ food, onUpdate }: EditDishProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  const [foodData, setFoodData] = useState({
    foodName: food.foodName,
    image: food.image,
    ingredients: food.ingredients,
    price: food.price,
    category: food.category,
  });

  // Update foodData when food prop changes
  useEffect(() => {
    setFoodData({
      foodName: food.foodName,
      image: food.image,
      ingredients: food.ingredients,
      price: food.price,
      category: food.category,
    });
  }, [food]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_BASE}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data.categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  const handleUpdate = async () => {
    if (!foodData.foodName || !foodData.category || !foodData.price) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Нэвтрэх шаардлагатай!");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE}/foods/${food._id}`,
        foodData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Update response:", response.data);
      alert("Хоолны мэдээлэл амжилттай шинэчлэгдлээ!");
      setOpen(false);
      onUpdate();
    } catch (err: any) {
      console.error("Update error:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Хоолны мэдээлэл шинэчлэхэд алдаа гарлаа!";
      alert(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Энэ хоолыг устгахдаа итгэлтэй байна уу?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Нэвтрэх шаардлагатай!");
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE}/foods/${food._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Delete response:", response.data);
      alert("Хоол амжилттай устгагдлаа!");
      setOpen(false);
      onUpdate();
    } catch (err: any) {
      console.error("Delete error:", err);
      const errorMessage =
        err.response?.data?.message || "Хоол устгахад алдаа гарлаа!";
      alert(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center p-0 rounded-full bg-white hover:bg-red-50 border-red-200"
        >
          <Pen className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[472px]">
        <DialogHeader>
          <DialogTitle>Dishes info</DialogTitle>
          <DialogDescription>
            Хоолны мэдээллийг засах эсвэл устгах
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="dishName">Dish name</Label>
            <Input
              id="dishName"
              value={foodData.foodName}
              onChange={(e) =>
                setFoodData({ ...foodData, foodName: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dishCategory">Dish category</Label>
            <Select
              value={foodData.category}
              onValueChange={(value) =>
                setFoodData({ ...foodData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ingredients">Ingredients</Label>
            <Textarea
              id="ingredients"
              value={foodData.ingredients}
              onChange={(e) =>
                setFoodData({ ...foodData, ingredients: e.target.value })
              }
              rows={3}
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
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <CloudinaryUpload
              onImageUpload={(imageUrl) => {
                console.log("Image URL received:", imageUrl);
                setFoodData({ ...foodData, image: imageUrl });
              }}
              currentImage={foodData.image}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Устгах
          </Button>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleUpdate}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
