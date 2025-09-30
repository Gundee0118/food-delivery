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
    <div className="flex gap-4 p-4 bg-white border-b border-dashed border-gray-300 last:border-b-0">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={food.image}
          alt={food.foodName}
          fill
          sizes="80px"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <h4 className="font-semibold text-red-500 text-base">
              {food.foodName}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {food.ingredients}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => handleDelete(food._id)}
            className="w-6 h-6 rounded-full bg-white hover:bg-gray-100 p-0 flex-shrink-0 border border-red-500"
          >
            <X className="text-red-500 h-3 w-3" />
          </Button>
        </div>
        <div className="flex justify-between items-center gap-5">
          <div className="flex items-center gap-0 flex-shrink-0">
            <Button
              onClick={() => decreaseQty(index)}
              variant="outline"
              className="rounded-full w-8 h-8 p-0 border-0 hover:bg-gray-100"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[20px] text-center text-base">
              {food.quantity}
            </span>
            <Button
              onClick={() => increaseQty(index)}
              variant="outline"
              className="rounded-full w-8 h-8 p-0 border-0 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="font-bold text-lg text-gray-900 min-w-0 flex-shrink-0">
            ${(food.price * food.quantity).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};
