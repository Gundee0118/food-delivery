"use client";

import { Menu, Truck, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F4F4F5CC]">
      <div className="flex flex-col w-[20%] min-h-screen bg-white">
        <div className="flex flex-col gap-4 flex-1">
          <p className="py-8 px-5">
            <Image src={"/logo.png"} alt={"log"} width={170} height={50} />
          </p>
          <Link
            className="flex items-center border rounded-full p-2 mx-8 justify-center gap-2"
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

        {/* Sign Out Button - зүүн доод булан */}
        <div className="p-6">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full border border-red-300 rounded-full p-3 justify-center text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign out
          </button>
        </div>
      </div>
      <div className="w-[80%] overflow-y-auto"> {children}</div>
    </div>
  );
}
