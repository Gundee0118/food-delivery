"use client";

import Image from "next/image";
import { FoodDetail } from "./FoodDetail";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type FoodProps = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
};

export type PropsType = {
  foods: Record<string, FoodProps[]>;
};

export const Card = ({ foods }: PropsType) => {
  console.log(foods, "from Cardss");

  // Handle nested foods object structure
  const actualFoods = foods?.foods || foods;
  const keys = actualFoods ? Object.keys(actualFoods) : [];
  const [open, setOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodProps>({
    foodName: "",
    image: "",
    ingredients: "",
    price: 0,
    _id: "",
  });

  return (
    <div className="">
      {keys.map((el) => {
        const categoryFoods = actualFoods[el as keyof typeof actualFoods];

        return (
          <div className="flex flex-col" key={el}>
            <div className="px-28 py-10">
              <h2 className="text-4xl text-[#FFFFFF]">{el}</h2>
            </div>
            {
              <div className="flex flex-wrap grid-cols-3 items-center justify-center gap-4">
                {(() => {
                  const categoryFoods =
                    actualFoods[el as keyof typeof actualFoods];
                  return Array.isArray(categoryFoods) ? (
                    categoryFoods.slice(0, 6).map((food) => {
                      return (
                        <div
                          onClick={() => {
                            console.log(food, "Only food");
                            setSelectedFood(food);
                            setOpen(!open);
                          }}
                          key={food._id}
                          className="flex flex-col w-[397px] rounded-md h-[342px] bg-[#FFFFFF] p-4 gap-5"
                        >
                          <div className="relative w-[365px] h-[210px]">
                            <Image
                              src={food.image}
                              alt={food.foodName}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              style={{ objectFit: "cover" }}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="flex justify-between">
                            <div className="text-[#EF4444]">
                              {food.foodName}
                            </div>
                            <div className="text-[#09090B]">${food.price}</div>
                          </div>
                          <div className="text-[#09090B]">
                            {food.ingredients}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-white">No foods available</div>
                  );
                })()}
              </div>
            }
            <FoodDetail open={open} setOpen={setOpen} {...selectedFood} />
          </div>
        );
      })}
    </div>
  );
};
