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
import { Form, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Gender, GenderOptions } from "@/lib/constants";
import { CreatePatientSchema } from "@/schemas";
import { useSigninStore } from "@/store/useSigninStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AddPatientDialog = () => {
  const { onClose } = useDialog();
  const { userId } = useSigninStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<
    Array<{
      condition: string;
      diagnosisDate?: string;
      treatment?: string;
      notes?: string;
    }>
  >([]);

  const form = useForm<z.infer<typeof CreatePatientSchema>>({
    resolver: zodResolver(CreatePatientSchema),
    defaultValues: {
      basicInfo: {
        name: "",
        email: "",
        phoneNumber: "",
      },
      createdById: userId || "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        form.setValue("basicInfo.imageUrl", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    form.setValue("basicInfo.imageUrl", "");
  };

  const addMedicalHistory = () => {
    setMedicalHistory([
      ...medicalHistory,
      { condition: "", diagnosisDate: "", treatment: "", notes: "" },
    ]);
  };

  const removeMedicalHistory = (index: number) => {
    const updated = [...medicalHistory];
    updated.splice(index, 1);
    setMedicalHistory(updated);
  };

  const updateMedicalHistory = (
    index: number,
    field: keyof (typeof medicalHistory)[0],
    value: string
  ) => {
    const updated = [...medicalHistory];
    updated[index] = { ...updated[index], [field]: value };
    setMedicalHistory(updated);
  };

  const onSubmit = async (data: z.infer<typeof CreatePatientSchema>) => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        medicalHistory: medicalHistory.filter((item) => item.condition),
      };

      const response = await axios.post("/api/patients/create", payload);
      toast.success("Patient created successfully");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("Failed to create patient");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6 flex flex-col h-full justify-between'
      >
        <div className='flex-1 px-4 flex-col justify-between h-full overflow-y-auto'>
          <div className='space-y-6'>
            <h3 className='font-medium text-brand-neutrals'>
              Patient Information
            </h3>

            {/* Profile Image Upload */}
            <div className='flex items-center gap-4'>
              <div className='w-22 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
                {selectedImage ? (
                  <Image
                    width={64}
                    height={64}
                    src={selectedImage}
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
                      document.getElementById("patient-upload")?.click()
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
                    id='patient-upload'
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
                  Patient profile picture (optional)
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <CustomFormField<z.infer<typeof CreatePatientSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='basicInfo.name'
                label='Full Name'
                placeholder='Enter patient name'
              />

              <CustomFormField<z.infer<typeof CreatePatientSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='basicInfo.email'
                label='Email Address'
                placeholder='Enter email address'
              />

              <CustomFormField<z.infer<typeof CreatePatientSchema>>
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name='basicInfo.phoneNumber'
                label='Phone Number'
                placeholder='(555) 123-4567'
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                label='Gender'
                name='basicInfo.gender'
                renderSkelton={(field) => (
                  <FormControl>
                    <RadioButtonGroup
                      name='gender'
                      options={Gender}
                      field={field}
                      value={field.value}
                    />
                  </FormControl>
                )}
              />

              <CustomFormField<z.infer<typeof CreatePatientSchema>>
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name='basicInfo.birthDate'
                label='Date of Birth'
                placeholder='YYYY-MM-DD'
              />

              <CustomFormField<z.infer<typeof CreatePatientSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='basicInfo.address'
                label='Address'
                placeholder='Enter address'
              />
            </div>

            {/* Medical History */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-medium text-brand-neutrals'>
                  Medical History
                </h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addMedicalHistory}
                >
                  <Plus size={16} className='mr-2' />
                  Add Condition
                </Button>
              </div>

              {medicalHistory.length > 0 ? (
                <div className='space-y-4'>
                  {medicalHistory.map((item, index) => (
                    <div
                      key={index}
                      className='p-4 border rounded-lg space-y-3 relative'
                    >
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute top-2 right-2 text-red-500'
                        onClick={() => removeMedicalHistory(index)}
                      >
                        <Trash size={16} />
                      </Button>

                      <CustomFormField<z.infer<typeof CreatePatientSchema>>
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name={`medicalHistory.${index}.condition`}
                        label='Medical Condition'
                        placeholder='Enter condition'
                        defaultValue={item.condition}
                        onChange={(value) =>
                          updateMedicalHistory(
                            index,
                            "condition",
                            value as string
                          )
                        }
                      />

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <CustomFormField<z.infer<typeof CreatePatientSchema>>
                          fieldType={FormFieldType.DATE_PICKER}
                          control={form.control}
                          name={`medicalHistory.${index}.diagnosisDate`}
                          label='Diagnosis Date'
                          placeholder='YYYY-MM-DD'
                          defaultValue={item.diagnosisDate}
                          onChange={(value) =>
                            updateMedicalHistory(
                              index,
                              "diagnosisDate",
                              value as string
                            )
                          }
                        />

                        <CustomFormField<z.infer<typeof CreatePatientSchema>>
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name={`medicalHistory.${index}.treatment`}
                          label='Treatment'
                          placeholder='Enter treatment'
                          defaultValue={item.treatment}
                          onChange={(value) =>
                            updateMedicalHistory(
                              index,
                              "treatment",
                              value as string
                            )
                          }
                        />
                      </div>

                      <CustomFormField<z.infer<typeof CreatePatientSchema>>
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name={`medicalHistory.${index}.notes`}
                        label='Notes'
                        placeholder='Additional notes'
                        defaultValue={item.notes}
                        onChange={(value) =>
                          updateMedicalHistory(index, "notes", value as string)
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-4 text-brand-neutrals/50'>
                  No medical conditions added
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog.Footer>
          <Button variant='outline' type='button' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='primary' type='submit' disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              "Create Patient"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};

export default AddPatientDialog;
