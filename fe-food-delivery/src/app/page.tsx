"use client";
import axios from "axios";
import { Card } from "./_components/Card";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [foodData, setFoodData] = useState<any>();
  const getData = async () => {
    const res = await axios.get("http://localhost:8000/foods");
    console.log(res, "hellooo");

    setFoodData(res.data);
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
          className="object-cover"
        />
      </div>
      <div className="bg-[#404040] py-1">
        <Card foods={foodData} />
      </div>
    </div>
  );
}
