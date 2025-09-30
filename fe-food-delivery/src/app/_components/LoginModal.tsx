"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "./UserProvider";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  const handleSignup = () => {
    onOpenChange(false);
    router.push("/signup");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            You need to log in first
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-center text-gray-600">
            Please log in or create an account to proceed with checkout.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleLogin}
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white"
            >
              Log in
            </Button>
            <Button
              onClick={handleSignup}
              variant="outline"
              className="flex-1 border-gray-300 hover:bg-gray-50"
            >
              Sign up
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
