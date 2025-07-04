"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PropsType = {
  backHandler: () => void;
};

const Verify = ({ backHandler }: PropsType) => {
  return (
    <div>
      <div className="flex py-5 px-5 items-center justify-center gap-8">
        <div className="flex flex-col gap-7">
          <Button onClick={backHandler} variant="secondary" className="w-fit">
            <ChevronLeft />
          </Button>
          <div>
            <p className="text-[24px] text-[#09090B] ">
              Please verify Your Email
            </p>
            <p className="text-[#71717A]">
              We just sent an email to Test@gmail.com. Click the link in the
              email to verify your account.
            </p>
          </div>
          <form>
            <InputOTP maxLength={4}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
            <div className="flex flex-col gap-3">
              <div className="text-red-500">
                {/* {formik.touched && formik.errors.email} */}
              </div>
              <div className="text-red-500"></div>
              <Button type="submit">Resend email</Button>
            </div>
          </form>
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
    </div>
  );
};
export default Verify;
