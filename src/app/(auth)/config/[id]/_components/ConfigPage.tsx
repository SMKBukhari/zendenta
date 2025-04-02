"use client";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Calendar from "@/icons/Calendar";
import IdCard from "@/icons/IdCard";
import Location from "@/icons/Location";
import { CompanyConfigFormSchema } from "@/schemas";
import { useConfigStore } from "@/store/useConfigStore";
import { useSigninStore } from "@/store/useSigninStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  id: string;
};

const ConfigPageComponent = ({ id }: Props) => {
  const { currentStep, setCurrentStep, formData, setFormData } =
    useConfigStore();
  const { isSignedIn, loginSessionToken, loginSessionExpiry } =
    useSigninStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CompanyConfigFormSchema>>({
    resolver: zodResolver(CompanyConfigFormSchema),
    defaultValues: {
      name: formData.companyBasicInfo.name,
      phoneNumber: formData.companyBasicInfo.phoneNumber,
      imageUrl: formData.companyBasicInfo.imageUrl,
      address: formData.comapnyAddressInfo.address,
    },
  });

  useEffect(() => {
    // Initialize form with stored values
    if (formData.companyBasicInfo.name) {
      form.setValue("name", formData.companyBasicInfo.name);
    }
    if (formData.companyBasicInfo.phoneNumber) {
      form.setValue("phoneNumber", formData.companyBasicInfo.phoneNumber);
    }
    if (formData.companyBasicInfo.imageUrl) {
      form.setValue("imageUrl", formData.companyBasicInfo.imageUrl);
    }
    if (formData.comapnyAddressInfo.address) {
      form.setValue("address", formData.comapnyAddressInfo.address);
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

    if (currentStep < 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return ["name", "phoneNumber", "city", "zipCode", "imageUrl"];
      case 1:
        return ["address"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: z.infer<typeof CompanyConfigFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/user/${id}/config`, data);
      const updatedUser = response.data.updateUser;
      if (isSignedIn) {
        if (
          loginSessionToken === updatedUser.loginSessionToken &&
          loginSessionExpiry === updatedUser.loginSessionExpiry
        ) {
          router.push("/dashboard");
          toast.success("Company configuration has been successfully saved.");
        } else {
          toast.info("You have been signed out. Please sign in again.");
        }
      } else {
        router.push("/sign-in");
        toast.success(
          "Company configuration has been successfully saved. You can now sign in."
        );
      }
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
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='flex justify-center w-full'
          >
            {currentStep === 1 && (
              <div className='space-y-4'>
                <CustomFormField<z.infer<typeof CompanyConfigFormSchema>>
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name='address'
                  label='Address'
                  placeholder='Enter company address'
                  icon={<Location />}
                  iconAlt='Location'
                  onChange={(value) => {
                    setFormData("comapnyAddressInfo", {
                      address: value as string,
                    });
                  }}
                />
              </div>
            )}

            {currentStep === 0 && (
              <div className='space-y-4 w-full max-w-md'>
                <CustomFormField<z.infer<typeof CompanyConfigFormSchema>>
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name='name'
                  label='Company Name'
                  placeholder='Enter company name'
                  icon={<IdCard />}
                  iconAlt='Id Card'
                  onChange={(value) => {
                    setFormData("companyBasicInfo", { name: value as string });
                  }}
                />

                <CustomFormField<z.infer<typeof CompanyConfigFormSchema>>
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name='phoneNumber'
                  label='Phone Number'
                  placeholder='(555) 123-4567'
                  onChange={(value) => {
                    setFormData("companyBasicInfo", {
                      phoneNumber: value as string,
                    });
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
            {currentStep < 1 && (
              <Button
                variant='primary'
                className='w-full'
                onClick={handleNext}
                type='button'
              >
                Next
              </Button>
            )}
            {currentStep === 1 && (
              <Button
                variant='primary'
                type='submit'
                className='w-full'
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  "Submit"
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ConfigPageComponent;
