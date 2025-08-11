"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dialog from "@/components/global/CustomDialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import { Check, FileText, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Image from "next/image";
import { Dentist } from "@/types";
import { Treatment, User } from "@prisma/client";
import { useReservationStore } from "@/store/useAddReservationStore";
import { AddReservationFormSchema } from "@/schemas";
import axios from "axios";
import { GenderOptions, stepVariants } from "@/lib/constants";
import RadioButtonGroup from "@/components/global/CustomRadioButton";

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  icon: React.ReactNode;
  label: string;
}

interface StepAnimationProps {
  children: React.ReactNode;
  key?: string;
}

interface RadioOptionProps {
  name: string;
  value: string;
  register: any; // This should be from react-hook-form's UseFormRegister
}

interface AddReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReservationAdded: () => void;
  selectedDate: Date;
  selectedTimeSlot?: string;
  selectedDentistId?: string;
  dentists: Dentist[];
  getAllTreatments?: Treatment[] | null;
}

const AddReservationDialog = ({
  isOpen,
  onClose,
  onReservationAdded,
  selectedDate,
  selectedTimeSlot,
  selectedDentistId,
  dentists,
  getAllTreatments,
}: AddReservationDialogProps) => {
  const [step, setStep] = useState(1);
  const [patientSuggestions, setPatientSuggestions] = useState<User[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const { currentStep, setCurrentStep, formData, setFormData, reset } =
    useReservationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward

  const fetchPatientSuggestions = async (query: string) => {
    if (query.length < 2) {
      setPatientSuggestions([]);
      return;
    }

    try {
      setIsLoadingPatients(true);
      const response = await fetch(
        `/api/patients/search?query=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch patient suggestions");
      }
      const data = await response.json();
      setPatientSuggestions(data);
    } catch (error) {
      console.error("Error fetching patient suggestions:", error);
      toast.error("Failed to fetch patient suggestions");
    } finally {
      setIsLoadingPatients(false);
    }
  };

  // Calculate end time (1 hour after start)
  const getEndTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = (Number.parseInt(hours) + 1) % 24;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  const form = useForm<z.infer<typeof AddReservationFormSchema>>({
    resolver: zodResolver(AddReservationFormSchema),
    defaultValues: formData,
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      reset();
    } else {
      // Set the selected date, dentist and time slot when dialog opens
      setFormData("treatmentInfo", { date: selectedDate });

      if (selectedDentistId) {
        setFormData("treatmentInfo", { dentistId: selectedDentistId });
        form.setValue("treatmentInfo.dentistId", selectedDentistId);
      }

      if (selectedTimeSlot) {
        setFormData("treatmentInfo", {
          startTime: selectedTimeSlot,
          endTime: getEndTime(selectedTimeSlot),
        });
        form.setValue("treatmentInfo.startTime", selectedTimeSlot);
        form.setValue("treatmentInfo.endTime", getEndTime(selectedTimeSlot));
      }
    }
  }, [
    isOpen,
    selectedDate,
    selectedDentistId,
    selectedTimeSlot,
    setFormData,
    reset,
    form,
    setCurrentStep,
  ]);

  // Fetch treatments
  useEffect(() => {
    const fetchTreatments = async () => {
      setTreatments(getAllTreatments || []);
    };

    if (isOpen) {
      fetchTreatments();
    }
  }, [getAllTreatments, isOpen]);

  // Update form when formData changes
  useEffect(() => {
    form.reset(formData);
  }, [form, formData]);

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1); // Set direction for animation
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    // Validate current step fields
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "treatmentInfo.treatmentId",
          "treatmentInfo.dentistId",
          "treatmentInfo.startTime",
          "treatmentInfo.endTime",
        ];
        break;
      case 2:
        fieldsToValidate = [
          "patientInfo.patientName",
          "patientInfo.age",
          "patientInfo.gender",
          "patientInfo.email",
          "patientInfo.phoneNumber",
          "patientInfo.address",
        ];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid) {
      setDirection(1); // Set direction for animation
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: z.infer<typeof AddReservationFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Format the data for the API
      const formattedData = {
        treatmentId: data.treatmentInfo.treatmentId,
        dentistId: data.treatmentInfo.dentistId,
        patientName: data.patientInfo.patientName,
        date: format(data.treatmentInfo.date, "yyyy-MM-dd"),
        startTime: data.treatmentInfo.startTime,
        endTime: data.treatmentInfo.endTime,
        quickNote: data.treatmentInfo.quickNote,
        patientDetails: {
          age: data.patientInfo.age,
          gender: data.patientInfo.gender,
          email: data.patientInfo.email,
          phoneNumber: data.patientInfo.phoneNumber,
          address: data.patientInfo.address,
        },
        oralHygieneHabits: {
          lastVisit: data.oralHygieneInfo.lastVisit,
          dentalCareStart: data.oralHygieneInfo.dentalCareStart,
          brushingFrequency: data.oralHygieneInfo.brushingFrequency,
          usesMouthwash: data.oralHygieneInfo.usesMouthwash,
          usesDentalFloss: data.oralHygieneInfo.usesDentalFloss,
        },
      };

      console.log("Formatted data:", formattedData);

      if (!treatments.some((t) => t.id === formattedData.treatmentId)) {
        toast.error("Selected treatment is invalid");
        return;
      }

      if (!dentists.some((d) => d.id === formattedData.dentistId)) {
        toast.error("Selected dentist is invalid");
        return;
      }

      // Send the data to the API

      const response = await axios.post(
        "/api/reservations/create",
        formattedData
      );

      // TODO: Handle the response, it giving error that missing required fields even all fields are provided but it not working

      console.log("Reservation created successfully:", response.data);

      // Close the dialog and refresh the reservations
      toast.success("Reservation added successfully");
      reset();
      onClose();
      onReservationAdded();
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Failed to create reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("Current form values:", form.getValues());
  }, [form]);

  // // Get the selected dentist
  // const selectedDentist = dentists.find(
  //   (d) => d.id === form.watch("dentistId")
  // );

  // Generate time options for the select fields
  const timeOptions = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // Start from 9am
    return {
      value: `${hour.toString().padStart(2, "0")}:00`,
      label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`,
    };
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>
              Treatment & Dentist
            </h3>
            <div className='w-full space-y-6'>
              <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name='treatmentInfo.treatmentId'
                label='Treatment'
                placeholder='Select treatment'
                options={treatments.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
                onChange={(value) => {
                  setFormData("treatmentInfo", {
                    treatmentId: value as string,
                  });
                }}
              />

              <div className='space-y-2'>
                <Label>Dentist</Label>
                <div className='grid grid-cols-1 gap-4'>
                  {dentists.map((dentist) => (
                    <div
                      key={dentist.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        form.watch("treatmentInfo.dentistId") === dentist.id
                          ? "border-brand-primary-blue bg-brand-light-blue/10"
                          : "border-brand-neutrals/20"
                      }`}
                      onClick={() => {
                        setFormData("treatmentInfo", { dentistId: dentist.id });
                        form.setValue("treatmentInfo.dentistId", dentist.id);
                      }}
                    >
                      <div className='w-10 h-10 rounded-full bg-brand-light-blue/20 flex items-center justify-center'>
                        {dentist.imageUrl ? (
                          <Image
                            width={40}
                            height={40}
                            src={dentist.imageUrl || "/placeholder.svg"}
                            alt={dentist.name}
                            className='w-10 h-10 rounded-full object-cover'
                          />
                        ) : (
                          <span className='text-brand-primary-blue font-medium'>
                            {dentist.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className='font-medium'>Drg {dentist.name}</div>
                        <div className='text-xs text-brand-neutrals/70'>
                          Today&apos;s appointment:{" "}
                          <span className='font-bold'>
                            {dentist.appointmentCount || 0} patient(s)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {form.formState.errors.treatmentInfo?.dentistId && (
                  <p className='text-red-500 text-sm mt-1'>
                    {form.formState.errors.treatmentInfo.dentistId.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <Label>Date & Time</Label>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 pl-2 border-l-[2px] border-brand-primary-blue'>
                    <div className='font-medium'>
                      {format(selectedDate, "EEEE, d MMM yyyy")}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name='treatmentInfo.startTime'
                      label=''
                      placeholder='Start time'
                      options={timeOptions}
                      defaultValue={formData.treatmentInfo.startTime}
                      onChange={(value) => {
                        setFormData("treatmentInfo", {
                          startTime: value as string,
                          endTime: getEndTime(value as string),
                        });
                        form.setValue(
                          "treatmentInfo.endTime",
                          getEndTime(value as string)
                        );
                      }}
                    />
                    <span>to</span>
                    <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name='treatmentInfo.endTime'
                      label=''
                      placeholder='End time'
                      options={timeOptions}
                      defaultValue={formData.treatmentInfo.endTime}
                      onChange={(value) => {
                        setFormData("treatmentInfo", {
                          endTime: value as string,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>
                  Quick Note{" "}
                  <span className='text-brand-neutrals/50'>(Optional)</span>
                </Label>
                <Textarea
                  placeholder='Type a message...'
                  className='resize-none'
                  {...form.register("treatmentInfo.quickNote")}
                  onChange={(e) => {
                    setFormData("treatmentInfo", {
                      quickNote: e.target.value,
                    });
                  }}
                />
                <div className='text-xs text-right text-brand-neutrals/50'>
                  {form.watch("treatmentInfo.quickNote")?.length || 0}/200
                </div>
              </div>

              <div className='space-y-2'>
                <Label>
                  Attached Files{" "}
                  <span className='text-brand-neutrals/50'>(Optional)</span>
                </Label>
                <div className='border border-dashed rounded-lg p-6 flex flex-col items-center justify-center'>
                  <div className='w-12 h-12 bg-brand-light-blue/10 rounded-lg flex items-center justify-center mb-2'>
                    <FileText className='h-6 w-6 text-brand-primary-blue' />
                  </div>
                  <p className='text-sm text-center'>
                    Drag & drop files here <br /> or{" "}
                    <span className='text-brand-primary-blue'>
                      Browse Files
                    </span>
                  </p>
                  <p className='text-xs text-brand-neutrals/50 mt-2'>
                    Maximum upload file sizes: 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>
              Patient Information
            </h3>
            <div className='space-y-4'>
              <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='patientInfo.patientName'
                label='Patient Name'
                placeholder='Start typing patient name...'
                onChange={(value) => {
                  setFormData("patientInfo", {
                    patientName: value as string,
                  });
                  fetchPatientSuggestions(value as string);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <AnimatePresence>
                {showSuggestions && patientSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className='absolute z-50 mt-1 w-full rounded-md border border-brand-neutrals/20 bg-white shadow-lg'
                  >
                    <div className='max-h-60 overflow-y-auto'>
                      {patientSuggestions.map((patient) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.1 }}
                          className='cursor-pointer px-4 py-3 hover:bg-brand-light-blue/10'
                          onClick={() => {
                            const age = patient.birthDate
                              ? (
                                  new Date().getFullYear() -
                                  new Date(patient.birthDate).getFullYear()
                                ).toString()
                              : "";

                            const gender =
                              patient.gender === "MALE" ? "MALE" : "FEMALE";

                            // Update form data
                            setFormData("patientInfo", {
                              patientName: patient.name,
                              email: patient.email,
                              phoneNumber: patient.phoneNumber,
                              address: patient.address || "",
                              gender: gender,
                              age: age,
                            });

                            // Update form values - make sure gender is set properly
                            form.setValue(
                              "patientInfo.patientName",
                              patient.name
                            );
                            form.setValue("patientInfo.email", patient.email);
                            form.setValue(
                              "patientInfo.phoneNumber",
                              patient.phoneNumber
                            );
                            form.setValue(
                              "patientInfo.address",
                              patient.address || ""
                            );
                            form.setValue("patientInfo.gender", gender); // This should match one of your option values
                            form.setValue("patientInfo.age", age);

                            setPatientSuggestions([]);
                          }}
                        >
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-brand-light-blue/20 flex items-center justify-center'>
                              {patient.imageUrl ? (
                                <Image
                                  width={32}
                                  height={32}
                                  src={patient.imageUrl}
                                  alt={patient.name}
                                  className='w-8 h-8 rounded-full object-cover'
                                />
                              ) : (
                                <span className='text-brand-primary-blue text-sm font-medium'>
                                  {patient.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className='font-medium'>{patient.name}</div>
                              <div className='text-xs text-brand-neutrals/70'>
                                {patient.email} • {patient.phoneNumber}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='grid gap-2 grid-cols-2'>
                <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name='patientInfo.age'
                  label='Age'
                  placeholder='Enter age'
                  onChange={(value) => {
                    setFormData("patientInfo", {
                      age: value as string,
                    });
                  }}
                />

                <div className='space-y-2'>
                  <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    label='Gender'
                    name='patientInfo.gender'
                    renderSkelton={(field) => (
                      <FormControl>
                        <RadioButtonGroup
                          className='w-full'
                          name='patientInfo.gender'
                          options={
                            GenderOptions?.map((gender) => ({
                              label: gender.name,
                              value: gender.value,
                            })) || []
                          }
                          field={field}
                          value={field.value} // Make sure this is passed correctly
                          onChange={(value) => {
                            setFormData("patientInfo", {
                              gender: value as "MALE" | "FEMALE",
                            });
                            field.onChange(value); // This is crucial to update react-hook-form's state
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='patientInfo.email'
                label='Email Address'
                placeholder='Enter email address'
                onChange={(value) => {
                  setFormData("patientInfo", {
                    email: value as string,
                  });
                }}
              />

              <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name='patientInfo.phoneNumber'
                label='Phone Number'
                placeholder='Enter phone number'
                onChange={(value) => {
                  setFormData("patientInfo", {
                    phoneNumber: value as string,
                  });
                }}
              />

              <CustomFormField<z.infer<typeof AddReservationFormSchema>>
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='patientInfo.address'
                label='Address'
                placeholder='Enter address'
                onChange={(value) => {
                  setFormData("patientInfo", {
                    address: value as string,
                  });
                }}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>
              Oral Hygiene Habits
            </h3>
            <div className='space-y-6'>
              <div className='bg-blue-50 p-4 rounded-lg flex items-start gap-2'>
                <div className='text-blue-500 mt-0.5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <line x1='12' y1='16' x2='12' y2='12'></line>
                    <line x1='12' y1='8' x2='12.01' y2='8'></line>
                  </svg>
                </div>
                <p className='text-sm text-blue-700'>
                  Oral Hygiene Habits is optional, you can do it later
                </p>
              </div>

              <div className='space-y-2'>
                <Label>1. When did you make the latest dental visit?</Label>
                <div className='grid grid-cols-2 gap-3'>
                  <RadioOption
                    name='oralHygieneInfo.lastVisit'
                    value='Less than 3 months ago'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.lastVisit'
                    value='1 year ago'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.lastVisit'
                    value='Less than 3 months ago'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.lastVisit'
                    value="I don't remember"
                    register={form.register}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>2. What time did you start dental care?</Label>
                <div className='grid grid-cols-2 gap-3'>
                  <RadioOption
                    name='oralHygieneInfo.dentalCareStart'
                    value='Teenager'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.dentalCareStart'
                    value='About 30 years old'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.dentalCareStart'
                    value='About 20 years old'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.dentalCareStart'
                    value='After 30 years old'
                    register={form.register}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>
                  3. How many time, in a day, do you wash your teeth?
                </Label>
                <div className='grid grid-cols-2 gap-3'>
                  <RadioOption
                    name='oralHygieneInfo.brushingFrequency'
                    value='Never'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.brushingFrequency'
                    value='Twice'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.brushingFrequency'
                    value='Once'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.brushingFrequency'
                    value='3 times'
                    register={form.register}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>4. Do you use mouthwash?</Label>
                <div className='grid grid-cols-2 gap-3'>
                  <RadioOption
                    name='oralHygieneInfo.usesMouthwash'
                    value='Yes'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.usesMouthwash'
                    value='No'
                    register={form.register}
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label>5. Do you use dental floss?</Label>
                <div className='grid grid-cols-2 gap-3'>
                  <RadioOption
                    name='oralHygieneInfo.usesDentalFloss'
                    value='Yes'
                    register={form.register}
                  />
                  <RadioOption
                    name='oralHygieneInfo.usesDentalFloss'
                    value='No'
                    register={form.register}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title='Add patient to waitlist'
      size='md'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='xl:space-y-6 space-y-4 flex flex-col h-full justify-between'
        >
          {/* Form steps */}
          <div className='flex-1 px-4 flex-col justify-between h-full'>
            <AnimatePresence mode='wait' custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
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

          {/* Footer buttons */}
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
                {currentStep < 3 && currentStep !== 0 && (
                  <Button
                    variant='primary'
                    className='w-full'
                    onClick={handleNext}
                    type='button'
                  >
                    Next
                  </Button>
                )}
                {currentStep === 3 && (
                  <Button
                    variant='primary'
                    type='submit'
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      "Add Treatment"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Dialog.Footer>
        </form>
      </Form>
    </Dialog>
  );
};

// Step indicator component
const StepIndicator = ({
  step,
  currentStep,
  icon,
  label,
}: StepIndicatorProps) => {
  const isCompleted = currentStep > step;
  const isActive = currentStep === step;

  return (
    <div className='flex flex-col items-center z-10'>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted
            ? "bg-green-500 text-white"
            : isActive
            ? "bg-brand-primary-blue text-white"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {isCompleted ? <Check className='h-5 w-5' /> : icon}
      </div>
      <span className='text-xs mt-1 text-center'>{label}</span>
    </div>
  );
};

// Animation wrapper for steps
const StepAnimation = ({ children, key }: StepAnimationProps) => {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Radio option component
const RadioOption = ({ name, value, register }: RadioOptionProps) => {
  return (
    <div className='border rounded-lg p-3 flex items-center space-x-2'>
      <input
        type='radio'
        id={`${name}-${value}`}
        value={value}
        {...register(name)}
        className='h-4 w-4 text-brand-primary-blue'
      />
      <Label htmlFor={`${name}-${value}`} className='cursor-pointer text-sm'>
        {value}
      </Label>
    </div>
  );
};

export default AddReservationDialog;
