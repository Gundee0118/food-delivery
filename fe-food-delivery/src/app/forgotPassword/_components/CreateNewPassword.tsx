"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
type PropsType = {
  backHandler: () => void;
};
const CreateNewPassword = ({ backHandler }: PropsType) => {
  return (
    <div className="flex py-5 px-5 items-center justify-center gap-8">
      <div className="flex flex-col gap-7">
        <Button variant="secondary" onClick={backHandler} className="w-fit">
          <ChevronLeft />
        </Button>
        <div>
          <p className="text-[24px] text-[#09090B] ">
            Create a strong password
          </p>
          <p className="text-[#71717A]">
            Create a strong password with letters, numbers.
          </p>
        </div>
        <form>
          <div className="flex flex-col gap-3">
            <Input placeholder="password" />
            <div className="text-red-500">
              {/* {formik.touched && formik.errors.confirm} */}
            </div>
            <Input placeholder="confirm" />
            <div className="text-red-500">
              {/* {formik.touched && formik.errors.confirm} */}
            </div>
            <Checkbox id="item" defaultChecked />

            <Button type="submit">Let's Go</Button>
          </div>
        </form>
        <div>
          <p className="text-[#71717A]">
            Already have an account?
            <Link
              href={"http://localhost:3000/login"}
              className="text-blue-800"
            >
              log in
            </Link>
          </p>
        </div>
      </div>
      <div>
        <Image
          src="/signup.jpg"
          className="rounded-md"
          width={856}
          height={904}
          alt="signup_pic"
        />
      </div>
    </div>
  );
};
export default CreateNewPassword;
