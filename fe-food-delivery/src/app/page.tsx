"use client";
import axios from "axios";
import { Card } from "./_components/Card";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [foodData, setFoodData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/foods`);
      console.log(res, "hellooo");
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
  }, []);
  console.log(foodData, "from page");

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
      <div className="bg-[#404040] py-1">
        {loading ? (
          <div className="text-white text-center py-10">Loading...</div>
        ) : (
          <Card foods={foodData} />
        )}
      </div>
    </div>
  );
}
