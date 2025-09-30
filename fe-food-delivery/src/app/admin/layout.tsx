"use client";

import { Menu, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-[#F4F4F5CC]">
      <div className="flex flex-col gap-15 w-[20%] min-h-screen bg-white">
        <p className="py-8 px-5">
          <Image src={"/logo.png"} alt={"log"} width={170} height={50} />
        </p>
        <Link
          className="flex items-center border rounded-full p-2 mx-8 justify-center"
          href={"/admin/menu"}
        >
          <Menu />
          Food menu
        </Link>
        <Link
          href={"/admin/orders"}
          className="flex gap-2 items-center border rounded-full p-2 mx-8 justify-center"
        >
          <Truck />
          Orders
        </Link>
      </div>
      <div className="w-[80%] overflow-y-auto"> {children}</div>
    </div>
  );
}
