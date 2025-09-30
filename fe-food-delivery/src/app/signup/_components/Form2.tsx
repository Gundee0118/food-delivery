"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useFormik } from "formik";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const validationSchemaLogin = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .required("Password is required"),
  confirm: Yup.string()
    .oneOf([Yup.ref("password")], "Password must match")
    .required("Confirm your password"),
});
type PropsType = {
  backHandler: () => void;
  email: string;
};
export const Form2 = ({ backHandler, email }: PropsType) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm: "",
    },
    validationSchema: validationSchemaLogin,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_BASE}/signup`, {
          email: email,
          password: values.password,
        });

        // if (response.data.message === "user already existed") {
        //   alert("asdasd");
        // } else {
        //   router.push("http://localhost:3000/login");
        // }
        router.push("/login");
      } catch (err) {
        console.log(err);
        alert("aldaa");
      }
    },
  });
  const passwordInputProps = {
    name: "password",
    type: "password",
    value: formik.values.password.trim(),
    onChange: formik.handleChange,
  };
  const confirmInputProps = {
    name: "confirm",
    type: "password",
    value: formik.values.confirm,
    onChange: formik.handleChange,
  };
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
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-3">
            <Input placeholder="password" {...passwordInputProps} />
            <div className="text-red-500">
              {formik.touched && formik.errors.password}
            </div>
            <Input placeholder="confirm" {...confirmInputProps} />
            <div className="text-red-500">
              {formik.touched && formik.errors.confirm}
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
