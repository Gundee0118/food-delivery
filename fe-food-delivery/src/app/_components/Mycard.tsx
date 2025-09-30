"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart } from "lucide-react";
import { AddFood } from "./AddFood";
import { useEffect, useState } from "react";
import { Payment } from "./Payment";
import { PendingDelivered } from "./PendingDelivered";
import axios from "axios";
import { useAuth } from "./UserProvider";
import { Textarea } from "@/components/ui/textarea";
import { LoginModal } from "./LoginModal";

type addFoodType = {
  foodName: string;
  image: string;
  ingredients: string;
  price: number;
  _id: string;
  quantity: number;
};
const storageKey = "foodOrderCard";

export const Mycard = () => {
  const [cartItems, setCartItems] = useState<addFoodType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { user } = useAuth();
  const [address, setAddress] = useState("");
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const loadCartData = () => {
      const existingData = localStorage.getItem("foodOrderCard");
      if (existingData) {
        const parsed = JSON.parse(existingData);
        setCartItems(parsed);
      }
    };

    // Load initial cart data
    loadCartData();

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCartData();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((acc: number, item: addFoodType) => {
      return (acc += item.price * item.quantity);
    }, 0);

    setTotalPrice(total);
  }, [cartItems]);

  const updateCart = (newChart: addFoodType[]) => {
    setCartItems(newChart);
    localStorage.setItem(storageKey, JSON.stringify(newChart));
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };
  const increaseQty = (index: number) => {
    const newChart = [...cartItems];
    newChart[index].quantity += 1;
    updateCart(newChart);
  };
  const decreaseQty = (index: number) => {
    const newChart = [...cartItems];
    if (newChart[index].quantity > 1) {
      newChart[index].quantity -= 1;
      updateCart(newChart);
    }
  };

  const handleDelete = (_id: string) => {
    const data = JSON.parse(localStorage.getItem("foodOrderCard") || "[]");
    const updateItems = data.filter((item: addFoodType) => item._id !== _id);
    updateCart(updateItems);
  };
  const checkOutSubmit = async () => {
    console.log("is being called");

    // Check if user is logged in
    if (!user?.userId) {
      setShowLoginModal(true);
      return;
    }

    // Check if address is provided
    if (!address.trim()) {
      setIsAddressInvalid(true);
      alert("Хүргэлтийн хаягаа оруулна уу!");
      return;
    }

    const backEndData = cartItems.map((food) => ({
      food: food._id,
      quantity: food.quantity,
    }));

    const totalPrice =
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) +
      0.99;

    const token = localStorage.getItem("token");
    console.log(token, "from checkout");

    try {
      const res = await axios.post(
        "http://localhost:8000/createOrder",
        {
          userId: user.userId,
          address,
          foodOrderItems: backEndData,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res, "axios is called");

      alert("Захиалга амжилттай илгээгдлээ");

      setCartItems([]);
      localStorage.setItem("foodOrderCard", "[]");
      setAddress("");

      // Trigger order update event
      window.dispatchEvent(new CustomEvent("orderUpdated"));
    } catch (error) {
      alert("Захиалга илгээхэд алдаа гарлаа");
      console.error(error, "//saaxaaxa");
    }
  };

  return (
    <div>
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <Sheet>
        <SheetTrigger asChild>
          <ShoppingCart className="bg-white rounded-full h-[36px] w-[36px]" />
        </SheetTrigger>
        <SheetContent className="bg-[#404040] overflow-y-auto w-[535px] h-screen">
          <SheetTitle className="sr-only">Order Details</SheetTitle>
          <SheetDescription className="sr-only">
            View your cart and order history
          </SheetDescription>
          <div className="flex w-full flex-col gap-6 p-4 items-center">
            <div className="flex items-center justify-center gap-2 text-white mb-4 w-full">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-lg font-semibold">Order detail</span>
            </div>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 mx-auto max-w-xs">
                <TabsTrigger
                  value="account"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  Cart
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  Order
                </TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="space-y-6">
                <div className="bg-white rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-700">
                      My cart
                    </h3>
                  </div>
                  <div>
                    {cartItems?.map((el: addFoodType, index: number) => {
                      return (
                        <AddFood
                          index={index}
                          food={el}
                          key={index}
                          decreaseQty={decreaseQty}
                          increaseQty={increaseQty}
                          handleDelete={handleDelete}
                        />
                      );
                    })}
                    {cartItems.length === 0 && (
                      <div className="text-center py-12 px-6">
                        <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                          <img
                            src="/s.png"
                            alt="Empty cart"
                            className="w-16 h-16 object-contain"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Your cart is empty
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Hungry? 🍕 Add some delicious dishes to your cart and
                          satisfy your cravings!
                        </p>
                      </div>
                    )}
                  </div>
                  {cartItems.length > 0 && (
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Delivery location
                      </h3>
                      <Textarea
                        placeholder="Please share your complete address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full min-h-[100px] border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                      {isAddressInvalid && (
                        <p className="text-red-500 text-sm mt-2">
                          Please enter your delivery address
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Payment totalPrice={totalPrice} onCheckout={checkOutSubmit} />
              </TabsContent>
              <TabsContent value="password">
                <PendingDelivered />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
