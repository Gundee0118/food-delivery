"use client";
import { EditDish } from "@/app/_components/EditDish";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Pen, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FoodType = {
  _id: string;
  foodName: string;
  image: string;
  price: number;
  ingredients: string;
  category?: string;
};

type Props = {
  foods: Record<string, FoodType[]>;
};
export const FoodType = ({ foods }: Props) => {
  const keys = Object.keys(foods);

  const [food, setFoods] = useState<Record<string, FoodType[]>>({});
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  const [foodData, setFoodData] = useState({
    foodName: "",
    image: "",
    ingredients: "",
    price: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = window?.localStorage?.getItem("token");
      try {
        // Categories татах
        const categoriesRes = await axios.get(`${API_BASE}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        console.log("Error fetching categories:", err);
      }

      try {
        // Foods татах
        const response = await axios.get(`${API_BASE}/foods`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFoods(response.data.foods);
      } catch (err) {
        console.log("Error fetching foods:", err);
      }
    };
    fetchData();
  }, []);

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
      setOpen(false);
      // Хоол нэмсний дараа жагсаалт шинэчлэх
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Хоол нэмэхэд алдаа гарлаа!");
    }
  };
  return (
    <div className="flex gap-6 flex-col mt-6">
      {keys.map((el, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-xl py-8 px-8 flex flex-col gap-4 shadow-sm border border-gray-100"
          >
            <h2 className="text-[#09090B] foreground text-[20px] ">
              {el} ({foods[el].length})
            </h2>
            <div className="flex gap-4">
              <div className="flex gap-5 flex-wrap grid-cols-1">
                <div className="bg-gray-50 h-[270px] w-[240px] border-2 border-dashed border-red-300 hover:border-red-500 flex flex-col gap-4 items-center justify-center rounded-xl transition-all duration-200 hover:bg-red-50">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="rounded-full bg-red-500 hover:bg-red-300"
                        variant={"ghost"}
                        onClick={() => setSelectedCategory(el)}
                      >
                        <Plus className="w-[16px] h-[16px]" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add new food to {el}</DialogTitle>
                        <DialogDescription>
                          Add a new dish to this category
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.categoryName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
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
                          <Label htmlFor="image">Image URL</Label>
                          <Input
                            id="image"
                            value={foodData.image}
                            onChange={(e) =>
                              setFoodData({
                                ...foodData,
                                image: e.target.value,
                              })
                            }
                            placeholder="Enter image URL"
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
                          <p className="text-xs text-gray-500">
                            Жишээ: 15000, 25000.50
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddFood}>Add Food</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <p className="">Add new Dish to {el}</p>
                </div>
                {foods[el].map((el, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-4 h-[270px] py-4 px-4 rounded-xl bg-white border border-gray-200 hover:shadow-md w-[250px] transition-all duration-200"
                    >
                      <div className="relative w-[95%] h-[140px]">
                        {el.image && el.image.trim() !== "" ? (
                          <Image
                            src={el.image}
                            alt={el.foodName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                            className="rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              Зураг байхгүй
                            </span>
                          </div>
                        )}
                        <EditDish
                          food={{
                            _id: el._id,
                            foodName: el.foodName,
                            image: el.image,
                            ingredients: el.ingredients,
                            price: el.price,
                            category: el.category || "",
                          }}
                          onUpdate={() => window.location.reload()}
                        />
                      </div>
                      <div className="flex justify-between">
                        <div>{el.foodName}</div>
                        <div>${el.price}</div>
                      </div>
                      <div>{el.ingredients}</div>

                      {/* {el.foodName} */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
