"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Map, Soup, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "./UserProvider";
import { compareAsc, format } from "date-fns";

type User = {
  userId: string;
};

type OrderType = {
  totalPrice: number;
  foodName: string;
  status: string;
  createdAt: string;
  quantity: number;
  _id: string;
  address: string;
  foodOrderItems: [
    {
      quantity: number;
      food: {
        foodName: string;
      };
    }
  ];
};

export const PendingDelivered = () => {
  const { user } = useAuth();
  console.log("userasdasd", user);
  const [orders, setOrders] = useState<OrderType[]>([]);

  const getOrders = async () => {
    if (!user?.userId) return;

    try {
      const { data } = await axios.get(
        `http://localhost:8000/getOrder?userId=${user.userId}`
      );
      setOrders(data.orders);

      console.log("hahaha", data);
    } catch (error) {
      console.error("Захиалга авахад алдаа гарлаа:", error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getOrders();
    }
  }, [user]);

  return (
    <div className="bg-white">
      {orders.length === 0 ? (
        <p>Захиалга олдсонгүй.</p>
      ) : (
        <div>
          <h2 className="pb-4 text-[#09090B]">Order history</h2>
          <div className="flex flex-col gap-6">
            {orders?.map((order, index) => (
              <div key={index} className="flex gap-2 justify-center flex-col">
                <div className="flex justify-between">
                  <div className="text-[#09090B]">{order.totalPrice}₮</div>
                  <Button className="p-2 h-[28px] rounded-full bg-white text-black border-red-500 border-1 text-[12px]">
                    {order.status}
                  </Button>
                </div>
                <div>
                  {order.foodOrderItems.map((item, index) => {
                    return (
                      <div className="flex justify-between">
                        <div
                          className="text-[12px] flex gap-2 text-[#71717A] "
                          key={index}
                        >
                          <Soup className="h-[16px] w-[16px]" />
                          {item.food.foodName}
                        </div>
                        <div
                          className="text-[12px] text-[#v#09090B] "
                          key={index}
                        >
                          x{item.quantity}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex text-[12px] gap-2 text-[#71717A]">
                  <Timer className="h-[16px] w-[16px]" />
                  <div>{format(new Date(order.createdAt), "yyyy/MM/dd")}</div>
                </div>
                <div className="flex text-[12px] gap-2 text-[#71717A]">
                  <Map className="h-[16px] w-[16px]" />
                  <div>{order.address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
