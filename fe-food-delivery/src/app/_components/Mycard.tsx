"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { AddFood } from "./AddFood";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Address } from "./Address";
import { Payment } from "./Payment";
import { PendingDelivered } from "./PendingDelivered";
import axios from "axios";
import { useAuth } from "./UserProvider";
import { Textarea } from "@/components/ui/textarea";

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

  useEffect(() => {
    const existingData = localStorage.getItem("foodOrderCard");
    if (existingData) {
      const parsed = JSON.parse(existingData);
      setCartItems(parsed);
    }
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
    const backEndData = cartItems.map((food) => ({
      food: food._id,
      quantity: food.quantity,
    }));

    const totalPrice =
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0) +
      0.99;

    const token = localStorage.getItem("token");
    console.log(token, "from checkout");
    if (!user?.userId) return;

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
    } catch (error) {
      alert("Захиалга илгээхэд алдаа гарлаа");
      console.error(error, "//saaxaaxa");
    }
  };

  const clearCard = () => setCartItems([]);

  //   <div className="flex justify-center p-2">
  //   {user?.userId ? (
  //     <CheckOutDialog
  //       CloseOrderCard={CloseOrderCard}
  //       checkOutSubmit={checkOutSubmit}
  //     />
  //   ) : (
  //     <DetailLogCart />
  //   )}
  // </div>

  // console.log(cartItems, "cartitems");
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <ShoppingCart className="bg-white rounded-full h-[36px] w-[36px]" />
        </SheetTrigger>
        <SheetContent className="bg-[#404040] overflow-y-scroll w-[535px]">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Tabs defaultValue="account" className="flex gap-5 p-5">
              <p className="flex text-white">
                <ShoppingCart /> Order detail
              </p>
              <TabsList className="w-full">
                <TabsTrigger value="account" className="active:bg-red-500">
                  Cart
                </TabsTrigger>
                <TabsTrigger value="password">Order</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="flex flex-col gap-4">
                <>
                  {/* <div className="flex flex-col gap-4"> */}
                  <div className=" bg-white rounded-md p-3">
                    <p className="text-[#71717A] pb-3">My card</p>
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
                  </div>
                  {/* </div> */}
                </>
                <div className=" bg-white pt-4 rounded-md items-center">
                  <h2 className="text-[#71717A]">Delivery location</h2>
                  <Textarea
                    value={address}
                    onChange={(el) => {
                      setAddress(el.target.value);
                      if (el.target.value.trim().length > 0) {
                        setIsAddressInvalid(false); // address бичих үед алдааг арилгана
                      }
                    }}
                    placeholder="Please complete your address"
                    className={`
      ${address ? "border border-red-500" : ""}
      mt-2
    `}
                  ></Textarea>
                </div>
                <Payment totalPrice={totalPrice} />
                <Button onClick={checkOutSubmit}>Checkout</Button>
              </TabsContent>
              <TabsContent value="password">
                <div className="h-[800] bg-white rounded-md w-full p-5">
                  <PendingDelivered />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
