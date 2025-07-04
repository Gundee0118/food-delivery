"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const Address = () => {
  const [address, setAddress] = useState("");
  const [isAddressInvalid, setIsAddressInvalid] = useState(false);
  return (
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
  );
};
