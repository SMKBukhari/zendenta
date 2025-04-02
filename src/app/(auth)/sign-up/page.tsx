"use client";
import { BackButton } from "@/components/global/auth/BackButton";
import { Button } from "@/components/ui/button";
import { useSignupStore } from "@/store/useSignupStore";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import { Form, FormControl } from "@/components/ui/form";
import { Gender, Roles } from "@/lib/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Mail from "@/icons/Mail";
import Lock from "@/icons/Lock";
import User from "@/icons/User";
import RadioButtonGroup from "@/components/global/CustomRadioButton";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SignUpPage = () => {
  const { currentStep, setCurrentStep, formData, setFormData } =
    useSignupStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      role: formData.role.role || "",
      email: formData.basicInfo.email || "",
      password: formData.basicInfo.password || "",
      name: formData.userInfo.name || "",
      phoneNumber: formData.userInfo.phoneNumber || "",
      gender: formData.userInfo.gender || "",
      birthDate: formData.userInfo.birthDate || "",
    },
  });

  useEffect(() => {
    // Initialize form with stored values
    if (formData.role.role) {
      form.setValue("role", formData.role.role);
    }
    if (formData.basicInfo.email) {
      form.setValue("email", formData.basicInfo.email);
    }
    if (formData.basicInfo.password) {
      form.setValue("password", formData.basicInfo.password);
    }
    if (formData.userInfo.name) {
      form.setValue("name", formData.userInfo.name);
    }
    if (formData.userInfo.phoneNumber) {
      form.setValue("phoneNumber", formData.userInfo.phoneNumber);
    }
    if (formData.userInfo.gender) {
      form.setValue("gender", formData.userInfo.gender);
    }
    if (formData.userInfo.birthDate) {
      form.setValue("birthDate", formData.userInfo.birthDate);
    }
  }, [formData, form]);

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Stop any unintended form submission
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any); // Validate only the current step fields

    if (!isValid) return; // Stop if validation fails

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return ["role"];
      case 1:
        return ["email", "password"];
      case 2:
        return ["name", "phoneNumber", "gender", "birthDate"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: z.infer<typeof SignUpFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/user", data);
      router.push(`/verify/${response.data.user.id}`);
      toast.success(
        "Account created successfully, Please First Verify Your Email."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='xl:space-y-6 space-y-4'
      >
        <AnimatePresence mode='wait'>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='flex justify-center w-full'
          >
            {currentStep === 0 && (
              <div className='space-y-4'>
                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name='role'
                  renderSkelton={(field) => (
                    <FormControl>
                      <RadioButtonGroup
                        name='role'
                        options={Roles}
                        field={field}
                        value={field.value}
                        onChange={(value) => {
                          setFormData("role", { role: value });
                        }}
                      />
                    </FormControl>
                  )}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div className='space-y-4 w-full max-w-md'>
                <CustomFormField<z.infer<typeof SignUpFormSchema>>
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name='email'
                  label='Email'
                  placeholder='Enter your email'
                  icon={<Mail />}
                  iconAlt='email'
                  onChange={(value) => {
                    setFormData("basicInfo", { email: value as string });
                  }}
                />

                <CustomFormField<z.infer<typeof SignUpFormSchema>>
                  fieldType={FormFieldType.PASSWORD_INPUT}
                  control={form.control}
                  name='password'
                  label='Password'
                  placeholder='Enter your password'
                  icon={<Lock />}
                  iconAlt='lock'
                  onChange={(value) => {
                    setFormData("basicInfo", { password: value as string });
                  }}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className='space-y-4 w-full max-w-md'>
                <CustomFormField<z.infer<typeof SignUpFormSchema>>
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  label='Full Name'
                  name='name'
                  placeholder='John Doe'
                  icon={<User />}
                  iconAlt='user'
                  onChange={(value) => {
                    setFormData("userInfo", { name: value as string });
                  }}
                />

                <CustomFormField<z.infer<typeof SignUpFormSchema>>
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name='phoneNumber'
                  label='Phone Number'
                  placeholder='(555) 123-4567'
                  onChange={(value) => {
                    setFormData("userInfo", { phoneNumber: value as string });
                  }}
                />
                <div className='space-y-4'>
                  <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    label='Gender'
                    name='gender'
                    renderSkelton={(field) => (
                      <FormControl>
                        <RadioButtonGroup
                          name='gender'
                          options={Gender}
                          field={field}
                          value={field.value}
                          onChange={(value) => {
                            setFormData("userInfo", { gender: value });
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                <CustomFormField<z.infer<typeof SignUpFormSchema>>
                  fieldType={FormFieldType.DATE_PICKER}
                  control={form.control}
                  name='birthDate'
                  label='Date of birth'
                  onChange={(value) => {
                    setFormData("userInfo", { birthDate: value as string });
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className='flex w-full gap-30 justify-between'>
          <div className='w-full'>
            {currentStep > 0 && (
              <Button
                variant='outline'
                className='w-full'
                onClick={handleBack}
                type='button'
              >
                Previous
              </Button>
            )}
          </div>
          <div className='w-full'>
            {currentStep < 2 && (
              <Button
                variant='primary'
                className='w-full'
                onClick={handleNext}
                type='button'
              >
                Next
              </Button>
            )}
            {currentStep === 2 && (
              <Button
                variant='primary'
                type='submit'
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  "Sign Up"
                )}
              </Button>
            )}
          </div>
        </div>

        <BackButton
          spanLabel='Already have account?'
          label={"Sign In"}
          href={"/sign-in"}
        />
      </form>
    </Form>
  );
};

export default SignUpPage;
