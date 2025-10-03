"use client";
import { EditDish } from "@/app/_components/EditDish";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AddFoodModal } from "./AddFoodModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type FoodType = {
  _id: string;
  foodName: string;
  image: string;
  price: number;
  ingredients: string;
  category?: string;
};

export const FoodType = () => {
  const [foods, setFoods] = useState<Record<string, FoodType[]>>({});
  const keys = Object.keys(foods);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categories, setCategories] = useState<
    { _id: string; categoryName: string }[]
  >([]);
  const [foodData, setFoodData] = useState({
    foodName: "",
    image: "",
    ingredients: "",
    price: 0,
  });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddFood = async () => {
    const token = localStorage.getItem("token");

    // Validation
    if (!foodData.foodName || !foodData.price || !selectedCategory) {
      alert("Бүх талбарыг бөглөнө үү!");
      return;
    }

    try {
      const dataToSend = {
        foodName: foodData.foodName,
        price: foodData.price,
        category: selectedCategory,
        ingredients: foodData.ingredients,
        image: foodData.image,
      };

      console.log("Sending data:", dataToSend);

      const res = await axios.post(`${API_BASE}/addFood`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 flex-col mt-6">
      {keys.map((el, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-xl py-8 px-8 flex flex-col gap-4 shadow-sm border border-gray-100"
          >
            <h2 className="text-[#09090B] font-bold text-[22px] tracking-tight">
              {el}{" "}
              <span className="text-gray-500 font-normal text-[18px]">
                ({foods[el].length})
              </span>
            </h2>
            <div className="w-full">
              <div className="grid grid-cols-4 gap-8">
                <div className="bg-gray-50 h-[270px] border-2 border-dashed border-red-300 hover:border-red-500 flex flex-col gap-4 items-center justify-center rounded-xl transition-all duration-200 hover:bg-red-50">
                  <Button
                    className="rounded-full bg-red-500 hover:bg-red-300"
                    variant={"ghost"}
                    onClick={() => {
                      // Категорийн нэрээр ID-г олох
                      const category = categories.find(
                        (cat) => cat.categoryName === el
                      );
                      if (category) {
                        setSelectedCategory(category._id);
                        setSelectedCategoryName(category.categoryName);
                      }
                      setFoodData({
                        foodName: "",
                        image: "",
                        ingredients: "",
                        price: 0,
                      });
                      setOpen(true);
                    }}
                  >
                    <Plus className="w-[16px] h-[16px]" />
                  </Button>
                  <p className="">Add new Dish to {el}</p>
                </div>
                <AddFoodModal
                  open={open && selectedCategoryName === el}
                  onOpenChange={setOpen}
                  categoryName={el}
                  foodData={foodData}
                  onFoodDataChange={setFoodData}
                  onSubmit={handleAddFood}
                />
                {foods[el].map((el, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-3 h-[270px] py-3 px-3 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-all duration-200"
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
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-base truncate flex-1 text-gray-800">
                          {el.foodName}
                        </div>
                        <div className="font-bold text-base ml-2 text-green-600">
                          ${el.price}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {el.ingredients}
                      </div>

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
