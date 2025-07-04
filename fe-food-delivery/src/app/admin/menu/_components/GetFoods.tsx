"use client";
import { EditDish } from "@/app/_components/EditDish";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Pen, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type FoodType = {
  _id: string;
  foodName: string;
  image: string;
  price: number;
  ingredients: string;
};

type Props = {
  foods: Record<string, FoodType[]>;
};
export const FoodType = ({ foods }: Props) => {
  const keys = Object.keys(foods);

  const [food, setFoods] = useState<Record<string, FoodType[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const token = window?.localStorage?.getItem("token");
      try {
      } catch (err) {
        const response = await axios.get("http://localhost:8000/foods", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFoods(response.data.foods);
        console.log(err, "errtr");
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex gap-5 flex-col">
      {keys.map((el, index) => {
        return (
          <div
            key={index}
            className="bg-white rounded-xl py-8 px-8 flex flex-col gap-4"
          >
            <h2 className="text-[#09090B] foreground text-[20px] ">
              {el} ({foods[el].length})
            </h2>
            <div className="flex gap-4">
              <div className="flex gap-5 flex-wrap grid-cols-1">
                <div className="bg-white h-[270px] w-[240px] border-1 border-dashed border-red-500 flex flex-col gap-4 items-center justify-center rounded-xl">
                  <Button
                    className="rounded-full bg-red-500 hover:bg-red-300"
                    variant={"ghost"}
                  >
                    <Plus className="w-[16px] h-[16px]" />
                  </Button>
                  <p className="">Add new Dish to {el}</p>
                </div>
                {foods[el].map((el, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-4 h-[270px] py-4 px-4 rounded-xl bg-amber-50 w-[250px]"
                    >
                      <div className="relative w-[95%] h-[140px]">
                        <Image
                          src={el.image}
                          alt={el.foodName}
                          fill
                          objectFit="cover"
                          className="rounded-xl"
                        />
                        <EditDish />
                      </div>
                      <div className="flex justify-between">
                        <div>{el.foodName}</div>
                        <div>{el.price}</div>
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
