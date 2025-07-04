"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Yup from "yup";
import { Form2 } from "./_components/Form2";
import { Form1 } from "./_components/Form1";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// const validationSchemaLogin = Yup.object({
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .matches(/[0-9]/, "Password must contain a number")
//     .matches(/[a-z]/, "Password must contain a lowercase letter")
//     .required("Password is required"),
//   confirm: Yup.string()
//     .oneOf([Yup.ref("password")], "Password must match")
//     .required("Confirm your password"),
// });
export default function Home() {
  //   const router = useRouter();
  const components = [Form1, Form2];
  const [step, setStep] = useState(0);
  const Stepper = components[step];

  const backHandler = () => {
    setStep((prev) => prev - 1);
  };
  const changeHandler = () => {
    setStep((prev) => prev + 1);
  };

  const [email, setEmail] = useState("");

  return (
    <div>
      <div>
        <Stepper
          backHandler={backHandler}
          changeHandler={changeHandler}
          email={email}
          setEmail={setEmail}
        />
      </div>
    </div>
  );
}

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       confirm: "",
//     },
//     validationSchema: validationSchemaLogin,
//     onSubmit: async (values) => {
//       const response = await axios.post("http://localhost:8000/signup", {
//         email: values.email,
//         password: values.password,
//       });
//       console.log(response, "asd");
//       router.push("/");
//     },
//   });
