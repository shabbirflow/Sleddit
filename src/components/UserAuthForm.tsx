"use client";
import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import { signIn } from "next-auth/react";
import { Icons } from "./ui/Icons";
import { useToast } from "@/hooks/use-toast";
import { stuff } from "@/constants/constants";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  // const toastTitle = stuff.googleToastDescription; console.log(stuff)

  const loginWithGoogle = async () => {
    setLoading(true);

    try {
      // throw new Error;
      await signIn("google");
    } catch (e) {
      console.log("AUTH ERROR HAHA: ", e);
      toast({
        title: stuff.googleToastTitle as string,
        description: stuff.googleToastDescription,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        onClick={loginWithGoogle}
        isLoading={loading}
        size="sm"
        className="w-full"
      >
        {loading ? null : <Icons.google className="h-4 w-4 mr-2" />} Sign in
        with google
      </Button>
    </div>
  );
};

export default UserAuthForm;
