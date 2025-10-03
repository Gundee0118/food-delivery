"use client";
import axios from "axios";
import { MapPin, Soup, Timer } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./UserProvider";
import { Payment } from "./Payment";
import { format } from "date-fns";
import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const getOrders = useCallback(async () => {
    if (!user?.userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_BASE}/getOrder?userId=${user.userId}`
      );
      setOrders(data.orders);
    } catch (error) {
      console.error("Захиалга авахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getOrders();
  }, [user, getOrders]);

  // Socket.io for real-time updates
  useEffect(() => {
    if (!user?.userId) return;

    const socket: Socket = io(API_BASE);

    socket.on("orderStatusChanged", (data: any) => {
      if (data.userId === user.userId) {
        getOrders(); // Refresh order list
        if (data.newStatus === "Delivered") {
          window.dispatchEvent(new CustomEvent("orderDelivered"));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, getOrders]);

  // Listen for order updates (from checkout)
  useEffect(() => {
    const handleOrderUpdate = () => {
      if (user?.userId) {
        getOrders();
      }
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, [user, getOrders]);

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Order history
      </h2>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">Loading orders...</p>
          </div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col gap-6">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <img
                src="/s.png"
                alt="No orders"
                className="w-16 h-16 object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              No Orders Yet?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You haven't placed any orders yet. Start exploring our menu and
              satisfy your cravings!
            </p>
          </div>
          <div className="mt-2">
            <Payment totalPrice={0} onCheckout={() => {}} />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order, index) => {
            const getStatusStyles = (status: string) => {
              switch (status) {
                case "Pending":
                  return "bg-blue-100 text-blue-700";
                case "Delivered":
                  return "bg-green-100 text-green-700";
                case "Cancelled":
                  return "bg-red-100 text-red-700";
                default:
                  return "bg-gray-100 text-gray-700";
              }
            };

            return (
              <div key={index}>
                <div className="flex gap-2 justify-center flex-col py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-[#09090B] font-semibold">
                      ${order.totalPrice}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-medium ${getStatusStyles(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div>
                    {order.foodOrderItems.map((item, itemIndex) => {
                      return (
                        <div key={itemIndex} className="flex justify-between">
                          <div className="text-[12px] flex gap-2 text-[#71717A]">
                            <Soup className="h-[16px] w-[16px]" />
                            {item.food?.foodName || "Unknown food"}
                          </div>
                          <div className="text-[12px] text-[#09090B]">
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
                    <MapPin className="h-[16px] w-[16px]" />
                    <div>{order.address}</div>
                  </div>
                </div>
                {index < orders.length - 1 && (
                  <div className="border-t border-dashed border-gray-300"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
