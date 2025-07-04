"use client";
import { useState } from "react";
import CreateNewPassword from "./_components/CreateNewPassword";
import { ResetPassword } from "./_components/ResetPassword";
import Verify from "./_components/Verify";

type mailType = {
  email: string;
  setEmail: any;
};
const ForgotPage = () => {
  const forms = [ResetPassword, Verify, CreateNewPassword];
  const [step, setStep] = useState(0);
  const Stepper = forms[step];
  const backHandler = () => {
    setStep((prev) => prev - 1);
  };
  const changeHandler = () => {
    setStep((prev) => prev + 1);
  };
  const [email, setEmail] = useState<string>("");
  return (
    <div>
      <Stepper
        backHandler={backHandler}
        changeHandler={changeHandler}
        // email={email}
        setEmail={setEmail}
      />
    </div>
  );
};
export default ForgotPage;
