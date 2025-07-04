"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";

const validationSchemaLogin = Yup.object({
  email: Yup.string()
    .required()
    .test("email", "Invalid email, example@gmail.com", (value) => {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      return emailRegex.test(value);
    }),
});
type PropsType = {
  changeHandler: () => void;
  setEmail: Dispatch<SetStateAction<string>>;
};
export const Form1 = ({ changeHandler, setEmail }: PropsType) => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchemaLogin,
    onSubmit: (values) => {
      setEmail(values.email);
      changeHandler();
    },
  });
  const emailInputProps = {
    placeholder: "Enter your email address",
    name: "email",
    value: formik.values.email,
    onChange: formik.handleChange,
  };
  const isButtonDisabled = !formik.errors.email;

  return (
    <div className="flex py-5 px-5 items-center justify-center gap-8">
      <div className="flex flex-col gap-7">
        <Button variant="secondary" className="w-fit">
          <ChevronLeft />
        </Button>
        <div>
          <p className="text-[24px] text-[#09090B] ">Create your account</p>
          <p className="text-[#71717A]">
            Sign up to explore your favorite dishes.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-3">
            <Input {...emailInputProps} />
            <div className="text-red-500">
              {formik.touched && formik.errors.email}
            </div>
            <Button type="submit" disabled={!isButtonDisabled}>
              Let's Go
            </Button>
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
