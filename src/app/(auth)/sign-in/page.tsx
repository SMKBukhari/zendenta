"use client";
import { BackButton } from "@/components/global/auth/BackButton";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { SignInFormSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Mail from "@/icons/Mail";
import Lock from "@/icons/Lock";
import axios from "axios";
import { useSigninStore } from "@/store/useSigninStore";

const SignInPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setIsSignedIn,
    setUserId,
    setLoginSessionExpiry,
    setLoginSessionToken,
  } = useSigninStore();

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInFormSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.patch("/api/user/signIn", values);
      const data = response.data;
      setUserId(data.user.id);
      setLoginSessionToken(data.user.loginSessionToken);
      setLoginSessionExpiry(data.user.loginSessionExpiry);
      setIsSignedIn(true);

      if (data.user.isVerified) {
        if (data.user.role === "ADMIN") {
          data.user.clinicId !== null
            ? (router.push("/dashboard"),
              toast.success("Signed in successfully!"))
            : (router.push(`/config/${data.user.id}`),
              toast.success(
                "Signed in successfully. Please configure your clinic!"
              ));
        } else {
          router.push("/dashboard");
          toast.success("Signed in successfully!");
        }
      } else {
        router.push(`/verify/${data.user.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        className='flex-1 xl:space-y-6 space-y-4 -mt-2'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='email'
          label='Email'
          placeholder='Enter your email'
          // iconSrc='/assets/icons/mail.svg'
          icon={<Mail />}
          iconAlt='email'
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD_INPUT}
          control={form.control}
          name='password'
          label='Password'
          placeholder='Enter your password'
          // iconSrc='/assets/icons/lock.svg'
          icon={<Lock />}
          iconAlt='lock'
        />

        <Button
          variant='primary'
          type='submit'
          className=''
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} className='animate-spin' /> : "Login"}
        </Button>

        <BackButton
          spanLabel="Don't have account?"
          label={"Register here"}
          href={"/sign-up"}
        />
      </form>
    </Form>
  );
};

export default SignInPage;
