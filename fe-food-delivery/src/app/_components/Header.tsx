"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, MapPin, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import { Mycard } from "./Mycard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "./UserProvider";
import axios from "axios";

type FoodProps = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
};

type PropsType = {
  foods: Record<string, FoodProps[]>;
};

export const Header = () => {
  const arr = ["/login", "/signup", "/admin/orders", "/admin/menu"];
  const path = usePathname();
  const [email, setEmail] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const { user } = useAuth();
  const previousOrderStatusesRef = useRef<Map<string, string>>(new Map());

  // Polling for order status changes
  const checkOrderStatus = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const { data } = await axios.get(
        `http://localhost:8000/getOrder?userId=${user.userId}`
      );

      const newOrders = data.orders;
      const previousStatuses = previousOrderStatusesRef.current;

      if (previousStatuses.size > 0) {
        newOrders.forEach((newOrder: any) => {
          const prevStatus = previousStatuses.get(newOrder._id);

          if (
            prevStatus &&
            prevStatus !== "Delivered" &&
            newOrder.status === "Delivered"
          ) {
            setShowDeliveredModal(true);
          }

          previousStatuses.set(newOrder._id, newOrder.status);
        });
      } else {
        newOrders.forEach((order: any) => {
          previousStatuses.set(order._id, order.status);
        });
      }
    } catch (error) {
      // Silent fail if not logged in
    }
  }, [user]);

  // Polling effect
  useEffect(() => {
    if (!user?.userId) return;

    const intervalId = setInterval(() => {
      checkOrderStatus();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user, checkOrderStatus]);

  // Listen for delivery notifications
  useEffect(() => {
    const handleDeliveryNotification = () => {
      setShowDeliveredModal(true);
    };

    window.addEventListener("orderDelivered", handleDeliveryNotification);
    return () => {
      window.removeEventListener("orderDelivered", handleDeliveryNotification);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
      console.log(storedEmail, "ddd");

      // Load initial cart count
      updateCartCount();

      // Listen for cart updates
      const handleCartUpdate = () => {
        updateCartCount();
      };

      window.addEventListener("cartUpdated", handleCartUpdate);

      return () => {
        window.removeEventListener("cartUpdated", handleCartUpdate);
      };
    }
  }, []);

  const updateCartCount = () => {
    const cartData = localStorage.getItem("foodOrderCard");
    if (cartData) {
      const cartItems = JSON.parse(cartData);
      const totalQuantity = cartItems.reduce(
        (acc: number, item: any) => acc + item.quantity,
        0
      );
      setCartCount(totalQuantity);
    } else {
      setCartCount(0);
    }
  };

  if (arr.includes(path)) {
    return null;
  }
  return (
    <>
      {showDeliveredModal && (
        <Dialog open={showDeliveredModal} onOpenChange={setShowDeliveredModal}>
          <DialogContent className="sm:max-w-lg bg-white rounded-3xl p-0">
            <DialogTitle className="sr-only">Order Delivered</DialogTitle>
            <DialogDescription className="sr-only">
              Your order has been successfully delivered
            </DialogDescription>
            <div className="flex flex-col items-center justify-center text-center p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Your order has been successfully placed !
              </h2>
              <div className="w-64 h-64 mb-8 flex items-center justify-center">
                <img
                  src="/illustration.png"
                  alt="Order delivered"
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                onClick={() => setShowDeliveredModal(false)}
                className="w-full max-w-xs bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg py-6 rounded-full"
              >
                Back to home
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex px-8 justify-between h-[172px] bg-[#18181B]">
        <div className="py-12">
          <Image
            src="/nomlogo.png"
            width={146}
            height={44}
            alt="nom logo baigaa shuu"
          />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <div className="bg-[#FFFFFF] my-2 h-[36px] items-center justify-center flex rounded-full">
            <div>
              <p className="flex items-center justify-center text-[#EF4444]">
                <MapPin /> Delivery address:
              </p>
            </div>
            <div>
              <p className="flex items-center justify-center text-[#71717A]">
                Add Location <ChevronRight />
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Mycard />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <User className="bg-[#EF4444] rounded-full h-[36px] w-[36px]" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="h-[104px] mt-10 rounded-md w-[188px] bg-[#FFFFFF]">
                  <div className="flex flex-col items-center justify-center gap-3 py-3">
                    <p> {email ? email : "No user"}</p>
                    <Button className="bg-[#F4F4F5] rounded-full text-[#18181B]">
                      Sign out
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};
