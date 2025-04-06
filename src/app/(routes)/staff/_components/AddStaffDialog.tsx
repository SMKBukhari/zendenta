"use client";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import Dialog, { useDialog } from "@/components/global/CustomDialog";
import RadioButtonGroup from "@/components/global/CustomRadioButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  JobType,
  JobTypeOption,
  SpecialtyOptions,
  stepVariants,
  WeekDays,
} from "@/lib/constants";
import { AddStaffFormSchema } from "@/schemas";
import { useAddStaffStore } from "@/store/useAddStaffStore";
import { AssignedServiceCategoryArray, TreatmentsArray } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddStaffDialogProps {
  assignedServiceCategory: AssignedServiceCategoryArray | null;
}

const AddStaffDialog = ({ assignedServiceCategory }: AddStaffDialogProps) => {
  const { onClose } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const {
    currentStep,
    setCurrentStep,
    formData,
    setStaffBasicInfo,
    setAssignedService,
    updateWorkingHours,
    reset,
  } = useAddStaffStore();

  const form = useForm<z.infer<typeof AddStaffFormSchema>>({
    resolver: zodResolver(AddStaffFormSchema),
    defaultValues: formData,
  });

  // Initialize form with store values when component mounts
  useEffect(() => {
    form.reset(formData);
  }, [form, formData]);

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any);

    if (!isValid) return;

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0: // Staff Info
        return [
          "staffBasicInfo.name",
          "staffBasicInfo.jobType",
          "staffBasicInfo.specialty",
          "staffBasicInfo.phoneNumber",
          "staffBasicInfo.email",
          "staffBasicInfo.address",
        ];
      case 1: // Assigned Services
        return ["assignedServices"];
      case 2: // Working Hours
        return ["workingHours"];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (
      assignedServiceCategory &&
      assignedServiceCategory.length > 0 &&
      (!formData.assignedServices || formData.assignedServices.length === 0)
    ) {
      const initialAssignedServices = assignedServiceCategory.flatMap(
        (category) =>
          category.treatments.map((treatment) => ({
            id: treatment.id,
            name: treatment.name,
            isAssigned: false,
            categoryId: category.id,
            categoryName: category.name,
          }))
      );

      form.setValue("assignedServices", initialAssignedServices);
    }
  }, [assignedServiceCategory, form, formData.assignedServices]);

  const servicesByCategory = React.useMemo(() => {
    if (!assignedServiceCategory) return {};

    return assignedServiceCategory.reduce((acc, category) => {
      acc[category.id] = {
        name: category.name,
        treatments: category.treatments,
      };
      return acc;
    }, {} as Record<string, { name: string; treatments: any[] }>);
  }, [assignedServiceCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setStaffBasicInfo({ imageUrl: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setStaffBasicInfo({ imageUrl: "" });
  };

  const onSubmit = async (data: z.infer<typeof AddStaffFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/staff/create", data);
      console.log("Staff member created:", response.data);
      toast.success("Staff member added successfully");
      reset();
      router.refresh();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          toast.error("Failed to add staff member");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Staff Info
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>
              Staff Information
            </h3>
            <div className='w-full space-y-6'>
              {/* Profile Image Upload */}
              <div className='flex items-center gap-4'>
                <div className='w-22 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                  {selectedImage ? (
                    <Image
                      width={64}
                      height={64}
                      src={selectedImage || "/placeholder.svg"}
                      alt='Profile'
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='text-gray-400'>Photo</span>
                  )}
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='flex gap-2'>
                    <span
                      onClick={() =>
                        document.getElementById("profile-upload")?.click()
                      }
                      className='text-brand-primary-blue font-medium cursor-pointer'
                    >
                      Upload Photo
                    </span>
                    {selectedImage && (
                      <span className='text-brand-neutrals/30'>|</span>
                    )}
                    <input
                      title='image'
                      id='profile-upload'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageUpload}
                    />
                    {selectedImage && (
                      <span
                        onClick={handleDeleteImage}
                        className='text-brand-primary-pink font-medium cursor-pointer'
                      >
                        Delete
                      </span>
                    )}
                  </div>
                  <p className='text-brand-neutrals/80'>
                    An image of the person, it&apos;s best if it has the same
                    width and height
                  </p>
                </div>
              </div>

              {/* Job Type */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                label='Job Type'
                name='staffBasicInfo.jobType'
                renderSkelton={(field) => (
                  <FormControl>
                    <RadioButtonGroup
                      className='w-full'
                      name='staffBasicInfo.jobType'
                      options={
                        JobTypeOption?.map((jobType) => ({
                          label: jobType.label,
                          value: jobType.value,
                        })) || []
                      }
                      field={field}
                      value={field.value}
                      onChange={(value) => {
                        setStaffBasicInfo({
                          jobType: value as "FULL_TIME" | "PART_TIME",
                        });
                      }}
                    />
                  </FormControl>
                )}
              />

              {/* Name */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='staffBasicInfo.name'
                label='Full Name'
                placeholder='Enter staff name'
                onChange={(value) => {
                  setStaffBasicInfo({ name: value as string });
                }}
              />

              {/* Specialty */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name='staffBasicInfo.specialty'
                label='Specialty'
                placeholder='Select specialty'
                options={SpecialtyOptions}
                onChange={(value) => {
                  setStaffBasicInfo({ specialty: value as string });
                }}
              />

              {/* Phone Number */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name='staffBasicInfo.phoneNumber'
                label='Phone Number'
                placeholder='(555) 123-4567'
                onChange={(value) => {
                  setStaffBasicInfo({ phoneNumber: value as string });
                }}
              />

              {/* Email */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='staffBasicInfo.email'
                label='Email Address'
                placeholder='Enter email address'
                onChange={(value) => {
                  setStaffBasicInfo({ email: value as string });
                }}
              />

              {/* Address */}
              <CustomFormField<z.infer<typeof AddStaffFormSchema>>
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='staffBasicInfo.address'
                label='Address'
                placeholder='Enter address'
                onChange={(value) => {
                  setStaffBasicInfo({ address: value as string });
                }}
              />
            </div>
          </div>
        );

      case 1: // Assigned Services
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>
              Assigned Services
            </h3>
            <div className='w-full space-y-6 max-h-[400px] overflow-y-auto pr-2'>
              {/* TODO: Implement Assigned Services here */}
              {Object.entries(servicesByCategory).length > 0 ? (
                <Accordion type='multiple' className='w-full'>
                  {Object.entries(servicesByCategory).map(
                    ([categoryId, category]) => (
                      <AccordionItem key={categoryId} value={categoryId}>
                        <AccordionTrigger className='hover:no-underline'>
                          <div className='flex items-center gap-2'>
                            <div className='bg-brand-light-blue/15 p-1 rounded-md'>
                              <span className='text-brand-primary-blue'>
                                {category.name}
                              </span>
                            </div>
                            <span className='text-sm text-brand-neutrals/70'>
                              {category.treatments.length} Services
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pl-2'>
                            {/* {category.treatments.map((treatment, index) => {
                              return (
                                <CustomFormField<
                                  z.infer<typeof AddStaffFormSchema>
                                >
                                  key={treatment.id}
                                  fieldType={FormFieldType.CHECKBOX}
                                  control={form.control}
                                  name={`assignedServices.${index}.isAssigned`}
                                  label={treatment.name}
                                  onChange={(value) => {
                                    setAssignedService(
                                      treatment.id,
                                      value as boolean
                                    );
                                  }}
                                />
                              );
                            })} */}
                            {category.treatments.map((treatment) => {
                              // Find the service in the form data
                              const assignedService =
                                formData.assignedServices?.find(
                                  (s) => s.id === treatment.id
                                );
                              const isChecked =
                                assignedService?.isAssigned || false;

                              // Log for debugging
                              console.log(
                                `Treatment ${treatment.name} (${treatment.id}):`,
                                isChecked
                              );

                              return (
                                <div
                                  key={treatment.id}
                                  className='flex items-center space-x-2'
                                >
                                  <Checkbox
                                    id={`service-${treatment.id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      console.log(
                                        `Checkbox ${treatment.name} changed to:`,
                                        checked
                                      );
                                      setAssignedService(
                                        treatment.id,
                                        checked === true
                                      );
                                    }}
                                  />
                                  <Label
                                    htmlFor={`service-${treatment.id}`}
                                    className='text-sm font-medium cursor-pointer'
                                  >
                                    {treatment.name}
                                  </Label>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  )}
                </Accordion>
              ) : (
                <div className='text-center py-8 text-brand-neutrals/50'>
                  No services available to assign
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Working Hours
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>Working Hours</h3>
            <div className='w-full space-y-4'>
              {Object.values(WeekDays).map((day) => {
                const dayData = formData.staffWorkingHours.find(
                  (wh) => wh.day === day
                );
                const isWorking = dayData?.isWorking || false;

                return (
                  <div
                    key={day}
                    className='flex items-center justify-between border-b pb-3'
                  >
                    <div className='flex items-center gap-3'>
                      <Switch
                        checked={isWorking}
                        onCheckedChange={(checked) => {
                          updateWorkingHours(day, checked);
                        }}
                        className='data-[state=checked]:bg-brand-primary-blue data-[state=unchecked]:bg-brand-neutrals/50'
                      />
                      <span className='font-medium text-brand-neutrals'>
                        {day}
                      </span>
                    </div>

                    {isWorking ? (
                      <div className='flex items-center gap-2'>
                        <Select
                          value={dayData?.startTime || "09:00 am"}
                          onValueChange={(value) => {
                            updateWorkingHours(
                              day,
                              true,
                              value,
                              dayData?.endTime
                            );
                          }}
                        >
                          <SelectTrigger className='w-[120px]'>
                            <SelectValue placeholder='Start time' />
                          </SelectTrigger>
                          <SelectContent className='z-[99999999]'>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <SelectItem
                                key={hour}
                                value={`${hour
                                  .toString()
                                  .padStart(2, "0")}:00 ${
                                  hour < 12 ? "am" : "pm"
                                }`}
                              >
                                {`${
                                  hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                                }:00 ${hour < 12 ? "am" : "pm"}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span>to</span>

                        <Select
                          value={dayData?.endTime || "05:00 pm"}
                          onValueChange={(value) => {
                            updateWorkingHours(
                              day,
                              true,
                              dayData?.startTime,
                              value
                            );
                          }}
                        >
                          <SelectTrigger className='w-[120px]'>
                            <SelectValue placeholder='End time' />
                          </SelectTrigger>
                          <SelectContent className='z-[99999999]'>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <SelectItem
                                key={hour}
                                value={`${hour
                                  .toString()
                                  .padStart(2, "0")}:00 ${
                                  hour < 12 ? "am" : "pm"
                                }`}
                              >
                                {`${
                                  hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                                }:00 ${hour < 12 ? "am" : "pm"}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <span className='text-gray-400'>
                        Not working on this day
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='xl:space-y-6 space-y-4 flex flex-col h-full justify-between'
      >
        <div className='flex-1 px-4 flex-col justify-between h-full'>
          <div>
            <AnimatePresence mode='wait' custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={stepVariants}
                initial='enter'
                animate='center'
                exit='exit'
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className='flex w-full'
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Dialog.Footer>
          <Button variant='outline' type='button' onClick={onClose}>
            Cancel
          </Button>
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
                    "Add Staff"
                  )}
                </Button>
              )}
            </div>
          </div>
        </Dialog.Footer>
      </form>
    </Form>
  );
};

export default AddStaffDialog;
