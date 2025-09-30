"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { FoodProps } from "./Card";
import { Plus, ShoppingCart } from "lucide-react";

type FoodDetailPropsType = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};
type PropsType = {
  foods: Record<string, FoodDetailPropsType[]>;
};
type UnitDataType = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
  quantity: number;
};

export const FoodDetail = ({
  foodName,
  image,
  ingredients,
  price,
  _id,
  open,
  setOpen,
}: FoodDetailPropsType) => {
  const [counter, setCounter] = useState<number>(1);
  const addCounter = () => {
    setCounter(counter + 1);
  };
  const hasahCounter = () => {
    counter > 1 && setCounter(counter - 1);
  };
  const storageKey = "foodOrderCard";

  const saveUnitData = (foodId: string) => {
    const existingData = localStorage.getItem(storageKey);
    const cartItems: UnitDataType[] = existingData
      ? JSON.parse(existingData)
      : [];

    const isFoodExisting = cartItems.find((item) => item._id === foodId);

    if (isFoodExisting) {
      const newFoods = cartItems.map((food) => {
        if (food._id === foodId) {
          return { ...food, quantity: food.quantity + counter };
        } else {
          return food;
        }
      });
      localStorage.setItem(storageKey, JSON.stringify(newFoods));
    } else {
      const newFoods = [
        ...cartItems,
        { foodName, price, image, ingredients, _id, quantity: counter },
      ];
      localStorage.setItem(storageKey, JSON.stringify(newFoods));
    }

    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cartUpdated"));

    setOpen(false);
  };
  console.log(foodName);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className=" !w-max-fit m-4 !w-[600px] !max-w-[600px]">
          <DialogTitle className="sr-only">Food Details</DialogTitle>
          <DialogDescription className="sr-only">
            View and add food to cart
          </DialogDescription>
          <div className="flex gap-4">
            <div className="relative w-1/2 h-[240px]">
              <Image
                src={image}
                alt={foodName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <div className="flex flex-col justify-between">
                <div className="text-[#EF4444] text-[30px]">{foodName}</div>
                <div className="text-[#09090B] text-[16px]">{ingredients}</div>
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-[16px]">Total price</div>
                  <h3 className="text-[#09090B] text-[24px]">
                    ${(price * counter).toLocaleString()}
                  </h3>
                </div>
                <div>
                  <Button
                    onClick={hasahCounter}
                    className="rounded-full w-[44px] h-[44px] bg-white border-[#E4E4E7] border-2 text-black"
                  >
                    -
                  </Button>
                  {counter}
                  <Button
                    onClick={addCounter}
                    className="rounded-full  w-[44px] h-[44px] bg-white border-[#E4E4E7] border-2 text-black"
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button onClick={() => saveUnitData(_id)}> Add to cart </Button>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
};
