"use client";

import { Button } from "@/components/ui/button";

export const Payment = ({ totalPrice }: { totalPrice: number }) => {
  const shipping = 6000;
  const sum = shipping + totalPrice;
  return (
    <div className="h-[276px] bg-white rounded-md p-5 flex flex-col gap-4">
      <p className="text-[#71717A]">Payment info</p>
      <div className="flex justify-between">
        <div className="text-[#71717A]">Items</div>
        <div className="text-[#09090B]">{totalPrice}₮</div>
      </div>
      <div className="flex justify-between">
        <div className="text-[#71717A]">Shipping</div>
        <div className="text-[#09090B]">{shipping}₮</div>
      </div>
      <div className="border-dashed h-[0px] border-2"></div>
      <div className="flex justify-between">
        <div className="text-[#71717A]">Total price</div>
        <div className="text-[#09090B]">{sum}₮</div>
      </div>
    </div>
  );
};
