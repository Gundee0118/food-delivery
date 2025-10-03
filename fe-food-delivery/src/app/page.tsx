"use client";
import axios from "axios";
import { Card } from "./_components/Card";
import { Footer } from "./_components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [foodData, setFoodData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/foods`);
      setFoodData(res.data);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setFoodData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();

    // Socket.io real-time updates
    const socket: Socket = io(API_BASE);

    socket.on("foodAdded", () => {
      getData(); // Refresh food list
    });

    socket.on("foodUpdated", () => {
      getData(); // Refresh food list
    });

    socket.on("foodDeleted", () => {
      getData(); // Refresh food list
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="relative h-[570px] w-full">
        <Image
          src="/BG.png"
          alt="end home page tom zurag bgaa"
          // width={1440}
          // height={570}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="bg-[#404040]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white text-lg">Loading foods...</p>
            </div>
          </div>
        ) : (
          <Card foods={foodData} />
        )}
      </div>
      <Footer />
    </div>
  );
}
