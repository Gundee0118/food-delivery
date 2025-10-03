"use client";

import { GetCategory } from "./_components/Getcategory";
import { FoodType } from "./_components/GetFoods";

const MenuHomepage = () => {
  return (
    <div className="flex flex-col w-[95%] mx-6 py-8 gap-6 min-h-screen">
      <div className="">
        <GetCategory />
      </div>

      <FoodType />
    </div>
  );
};

export default MenuHomepage;
