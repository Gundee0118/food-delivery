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

  if (arr.includes(path)) {
    return null;
  }

  const [email, setEmail] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
      console.log(storedEmail, "ddd");
    }
  }, []);
  return (
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
          <Mycard />
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
  );
};
