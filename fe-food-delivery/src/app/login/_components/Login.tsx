"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/UserProvider";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const Login = () => {
  const { user, tokenChecker } = useAuth();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${API_BASE}/login`, {
          email: values.email,
          password: values.password,
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", values.email);
        await tokenChecker(response.data.token);
      } catch (err: any) {
        alert(err.response.data.message);
      }
    },
  });
  const loginEmailInputProps = {
    placeholder: "Enter your email",
    name: "email",
    value: formik.values.email,
    onChange: formik.handleChange,
  };
  const loginPasswordInputProps = {
    placeholder: "Enter your password",
    name: "password",
    value: formik.values.password,
    onChange: formik.handleChange,
  };
  const isButtonDisabled = !formik.errors.email && formik.values;

  if (user?.userId) {
    if (user?.isAdmin === true) {
      redirect("/admin/orders");
    } else {
      redirect("/");
    }
  }

  return (
    <div className="flex py-5 px-5 items-center justify-center gap-8">
      <div className="flex flex-col gap-7">
        <Button variant="secondary" className="w-fit">
          <ChevronLeft />
        </Button>
        <div>
          <p className="text-[24px] text-[#09090B] ">Login</p>
          <p className="text-[#71717A]">
            Log in to enjoy your favorite dish es.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-3">
            <Input {...loginEmailInputProps} />
            <div className="text-red-500">
              {formik.touched && formik.errors.email}
            </div>
            <Input {...loginPasswordInputProps} />
            <div className="text-red-500">
              {formik.touched && formik.errors.password}
            </div>
            <Link
              href={"http://localhost:3000/forgotPassword"}
              className="text-[#18181B]"
            >
              Forgot password ?
            </Link>
            <div className="text-red-500"></div>
            <Button type="submit" disabled={!isButtonDisabled}>
              Let's Go
            </Button>
          </div>
        </form>
        <div>
          <p className="text-[#71717A]">
            Don’t have an account?
            <Link
              href={"http://localhost:3000/signup"}
              className="text-blue-800"
            >
              Sign up
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
