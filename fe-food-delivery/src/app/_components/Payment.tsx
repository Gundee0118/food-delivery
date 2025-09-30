"use client";

import { Button } from "@/components/ui/button";

export const Payment = ({
  totalPrice,
  onCheckout,
}: {
  totalPrice: number;
  onCheckout: () => void;
}) => {
  const itemsTotal = totalPrice;
  const shipping = itemsTotal > 0 ? 0.99 : 0;
  const finalTotal = itemsTotal + shipping;

  return (
    <div className="bg-white rounded-md p-4 w-full max-w-md mx-auto">
      <h3 className="text-[#71717A] text-lg font-semibold mb-4 text-center">
        Payment info
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[#71717A]">Items</span>
          <span className="text-[#09090B] font-medium">
            {itemsTotal > 0 ? `$${itemsTotal.toFixed(2)}` : "-"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#71717A]">Shipping</span>
          <span className="text-[#09090B] font-medium">
            {itemsTotal > 0 ? `$${shipping.toFixed(2)}` : "-"}
          </span>
        </div>
        <div className="border-t border-dashed border-gray-300 my-3"></div>
        <div className="flex justify-between items-center">
          <span className="text-[#71717A] font-semibold text-lg">Total</span>
          <span className="text-[#09090B] font-bold text-xl">
            {finalTotal > 0 ? `$${finalTotal.toFixed(2)}` : "-"}
          </span>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        className="w-full mt-4 py-3 text-lg font-semibold rounded-lg text-white"
        style={{
          backgroundColor: itemsTotal > 0 ? "#EF4444" : "#FDDCDC",
        }}
      >
        Checkout
      </Button>
    </div>
  );
};
