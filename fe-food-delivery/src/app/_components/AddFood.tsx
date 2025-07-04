"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Address } from "./Address";
import { Payment } from "./Payment";
import { PropsType } from "./Card";

type addFoodType = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
  quantity: number;
};

type FunctionType = {
  food: addFoodType;
  index: number;
  decreaseQty: (_qty: number) => void;
  increaseQty: (_qty: number) => void;
  handleDelete: (_id: string) => void;
};

export const AddFood = ({
  food,
  index,
  increaseQty,
  decreaseQty,
  handleDelete,
}: FunctionType) => {
  return (
    <div className="flex gap-4">
      <div className="relative h-[124px] w-[124px]">
        <Image
          src={food.image}
          alt={food.foodName}
          fill
          className="rounded-xl"
        />
      </div>
      <div className=" flex flex-col gap-5">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div>{food.foodName}</div>
            <div>{food.ingredients}</div>
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => handleDelete(food._id)}
              className="border w-[36px] h-[36px] rounded-full border-[#EF4444] cursor-pointer"
            >
              <X className="text-[#EF4444]" />
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <Button
                onClick={() => decreaseQty(index)}
                variant="ghost"
                className="rounded-full w-9 h-9"
              >
                <Minus />
              </Button>
            </div>
            <p className="">{food.quantity}</p>
            <div>
              <Button
                onClick={() => increaseQty(index)}
                variant="ghost"
                className="rounded-full w-9 h-9"
              >
                <Plus />
              </Button>
            </div>
          </div>
          <div>
            <div className="font-semibold whitespace-nowrap">
              ${(food.price * food.quantity).toFixed(2)}₮
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
