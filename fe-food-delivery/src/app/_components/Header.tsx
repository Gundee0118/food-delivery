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
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "./UserProvider";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

  // Socket.io for real-time order status updates
  useEffect(() => {
    if (!user?.userId) return;

    const socket: Socket = io(API_BASE);

    socket.on("orderStatusChanged", (data: any) => {
      if (data.userId === user.userId && data.newStatus === "Delivered") {
        setShowDeliveredModal(true);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Listen for delivery notifications (from other components)
  useEffect(() => {
    const handleDeliveryNotification = () => {
      setShowDeliveredModal(true);
    };

    window.addEventListener("orderDelivered", handleDeliveryNotification);
    return () => {
      window.removeEventListener("orderDelivered", handleDeliveryNotification);
    };
  }, []);

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        setEmail("");
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
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
                <User className="bg-[#EF4444] rounded-full h-[36px] w-[36px] cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="w-[160px] p-3">
                {user?.userId ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-gray-700 truncate text-center">
                      {email}
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 h-8 text-xs"
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("email");
                        localStorage.removeItem("userId");
                        setEmail("");
                        window.location.href = "/";
                      }}
                    >
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-center text-gray-500 mb-1 leading-tight">
                      Та бүртгэлээрээ нэвтэрч орно уу, бүртгэлгүй бол бүртгүүлнэ
                      үү
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 h-8 text-xs"
                      onClick={() => {
                        window.location.href = "/login";
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      className="w-full bg-gray-900 rounded-md text-white hover:bg-gray-800 h-8 text-xs"
                      onClick={() => {
                        window.location.href = "/signup";
                      }}
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};
