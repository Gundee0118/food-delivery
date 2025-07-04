import axios from "axios";
import { GetCategory } from "./_components/Getcategory";
import { FoodType } from "./_components/GetFoods";

const MenuHomepage = async () => {
  const { data } = await axios.get("http://localhost:8000/foods");
  return (
    <div className="flex flex-col w-[95%] mx-6 my-15 gap-4">
      <div className="">
        <GetCategory />
      </div>

      {/* <getFood foods={data.foods} /> */}
      <FoodType foods={data.foods} />
    </div>
  );
};

export default MenuHomepage;
