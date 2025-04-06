"use client";
import CustomFormField, {
  FormFieldType,
} from "@/components/global/auth/CustomFormField";
import Dialog, { useDialog } from "@/components/global/CustomDialog";
import RadioButtonGroup from "@/components/global/CustomRadioButton";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import {
  EstimatedTime,
  FreeOptions,
  stepVariants,
  TreatmentCategories,
} from "@/lib/constants";
import { AddTreatmentFormSchema } from "@/schemas";
import { useTreatmentStore } from "@/store/useAddTreatmentStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { TreatmentCategory, TreatmentComponents } from "@prisma/client";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface AddTreatmentDialogProps {
  categories: TreatmentCategory[] | null;
  components: TreatmentComponents[] | null;
}

const AddTreatmentDialog = ({
  categories,
  components,
}: AddTreatmentDialogProps) => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    reset,
    addVisit,
    removeVisit,
    updateVisit,
    addComponent,
    removeComponent,
    updateComponent,
  } = useTreatmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const router = useRouter();
  const { onClose } = useDialog();

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Stop any unintended form submission
    if (currentStep > 0) {
      setDirection(-1); // Set direction for animation
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    const fields = getStepFields(currentStep);
    const isValid = await form.trigger(fields as any); // Validate only the current step fields

    if (!isValid) return; // Stop if validation fails

    if (currentStep < 2) {
      setDirection(1); // Set direction for animation
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepFields = (step: number) => {
    switch (step) {
      case 0:
        return [
          "treatmentName",
          "treatmentCategoryId",
          "treatmentDescription",
          "price",
          "estimatedTime",
        ];
      case 1:
        return [
          "treatmentVisitName",
          "treatmentVisitDescription",
          "treatmentVisitEstimatedTime",
        ];
      case 2:
        return [
          "treatmentComponentsId",
          "isTotallyFree",
          "freeUpTo",
          "quantity",
        ];
      default:
        return [];
    }
  };

  const form = useForm<z.infer<typeof AddTreatmentFormSchema>>({
    resolver: zodResolver(AddTreatmentFormSchema),
    defaultValues: formData,
  });

  const calculateTotalPrice = useCallback(() => {
    const visitsTotal =
      formData.treatmentVisits?.reduce((sum, visit) => {
        return sum + (visit.TreatmentVisitPrice || 0);
      }, 0) || 0;

    const componentsTotal =
      formData.treatmentComponents?.reduce((sum, component) => {
        const componentData = components?.find(
          (c) => c.id === component.treatmentComponentsId
        );
        const componentPrice = componentData?.price || 0;
        const quantity = component.quantity || 1;
        return sum + componentPrice * quantity;
      }, 0) || 0;

    return visitsTotal + componentsTotal;
  }, [formData.treatmentVisits, formData.treatmentComponents, components]);

  const calculateTotalEstimatedTime = useCallback(() => {
    if (!formData.treatmentVisits?.length) return "";

    // Convert all visit times to minutes for calculation
    const totalMinutes = formData.treatmentVisits.reduce((sum, visit) => {
      const time = visit.treatmentVisitEstimatedTime;
      if (!time) return sum;

      // Improved parsing logic
      let hours = 0;
      let minutes = 0;

      // Handle cases like "1h", "30min", "1h30min"
      if (time.includes("h") && time.includes("min")) {
        // Format: "1h30min"
        const parts = time.split("h");
        hours = parseInt(parts[0]) || 0;
        minutes = parseInt(parts[1].replace("min", "")) || 0;
      } else if (time.includes("h")) {
        // Format: "1h"
        hours = parseInt(time.replace("h", "")) || 0;
      } else if (time.includes("min")) {
        // Format: "30min"
        minutes = parseInt(time.replace("min", "")) || 0;
      }

      return sum + hours * 60 + minutes;
    }, 0);

    // Convert total minutes back to readable format
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Format the output string
    if (hours > 0 && minutes > 0) return `${hours}h${minutes}min`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return ""; // Return empty string if no time is calculated
  }, [formData.treatmentVisits]);

  useEffect(() => {
    if (formData.treatmentVisits?.length) {
      const totalPrice = calculateTotalPrice();
      const totalTime = calculateTotalEstimatedTime();

      console.log("Calculated total time:", totalTime); // Debug log

      setFormData("treatmentPriceInfo", {
        price: totalPrice,
        estimatedTime:
          totalTime || formData.treatmentPriceInfo?.estimatedTime || "",
      });

      form.setValue("treatmentPriceInfo.price", totalPrice);
      form.setValue("treatmentPriceInfo.estimatedTime", totalTime || "");
    }
  }, [
    formData.treatmentVisits,
    formData.treatmentComponents,
    calculateTotalPrice,
    calculateTotalEstimatedTime,
    form,
    setFormData,
    formData.treatmentPriceInfo?.estimatedTime,
  ]);

  const onSubmit = async (data: z.infer<typeof AddTreatmentFormSchema>) => {
    try {
      setIsLoading(true);
      await axios.post("/api/treatments/create", {
        name: data.treatmentBasicInfo.treatmentName,
        description: data.treatmentBasicInfo.treatmentDescription,
        price: data.treatmentPriceInfo.price,
        estimatedTime: data.treatmentPriceInfo.estimatedTime,
        categoryId: data.treatmentBasicInfo.treatmentCategoryId,
        visits: data.treatmentVisits?.map((visit) => ({
          name: visit.treatmentVisitName,
          description: visit.treatmentVisitDescription,
          price: visit.TreatmentVisitPrice,
          estimatedTime: visit.treatmentVisitEstimatedTime,
        })),
        components: data.treatmentComponents?.map((component) => ({
          componentId: component.treatmentComponentsId,
          quantity: component.quantity,
        })),
      });
      console.log("Form Submitted", data);
      toast.success("Treatment added successfully");
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to add treatment");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='space-y-5 w-full'>
            <h3 className='font-medium text-brand-neutrals'>Basic Info</h3>
            <div className='w-full space-y-6'>
              <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name='treatmentBasicInfo.treatmentName'
                label='Treatment Name'
                placeholder='Enter treatment name'
                onChange={(value) => {
                  setFormData("treatmentBasicInfo", {
                    treatmentName: value as string,
                  });
                }}
              />

              <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                label='Treatment Category'
                name='treatmentBasicInfo.treatmentCategoryId'
                renderSkelton={(field) => (
                  <FormControl>
                    <RadioButtonGroup
                      className='w-full'
                      name='treatmentBasicInfo.treatmentCategoryId'
                      options={
                        categories?.map((category) => ({
                          label: category.name,
                          value: category.id,
                        })) || []
                      }
                      field={field}
                      value={field.value}
                      onChange={(value) => {
                        setFormData("treatmentBasicInfo", {
                          treatmentCategoryId: value || "",
                        });
                      }}
                    />
                  </FormControl>
                )}
              />

              <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name='treatmentBasicInfo.treatmentDescription'
                label='Treatment Description'
                placeholder='Enter treatment description'
                onChange={(value) => {
                  setFormData("treatmentBasicInfo", {
                    treatmentDescription: value as string,
                  });
                }}
              />

              <div className='bg-brand-light-blue/10 flex justify-between p-2 px-4 pr-2 border-l-3 border-brand-primary-blue'>
                <div className='flex flex-col'>
                  <p className='text-brand-primary-blue'>Set Multiple Visit</p>
                  <span className='text-brand-neutrals/70 text-xs'>
                    Set multiple visits if the treatment requires multiple
                    visits
                  </span>
                </div>
                <Button
                  variant={"ghost"}
                  className='hover:bg-transparent text-brand-primary-blue hover:text-brand-primary-blue'
                  onClick={handleNext}
                  type='button'
                >
                  Setup
                </Button>
              </div>
              <div className='border-t-2 border-brand-neutrals/20 mt-10 pt-5 space-y-5'>
                <h3 className='font-medium text-brand-neutrals'>
                  Price & Duration
                </h3>
                <div className='flex gap-5'>
                  <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                    fieldType={FormFieldType.CURRENCY_INPUT}
                    control={form.control}
                    name={`treatmentPriceInfo.price`}
                    label='Price Treatment'
                    placeholder='Enter price'
                    currency='$'
                    onChange={(value) => {
                      setFormData("treatmentPriceInfo", {
                        price: Number(value),
                      });
                    }}
                    disabled={
                      formData.treatmentVisits?.length! > 0 ||
                      formData.treatmentComponents?.length! > 0
                    }
                  />

                  <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name='treatmentPriceInfo.estimatedTime'
                    label='Total Duration Treatment'
                    placeholder='Enter estimated time'
                    disabled={formData.treatmentVisits?.length! > 0}
                    onChange={(value) => {
                      setFormData("treatmentPriceInfo", {
                        estimatedTime: value as string,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className='space-y-5 w-full'>
            <div className='flex justify-between w-full items-center'>
              <h3 className='font-medium text-brand-neutrals'>
                Visitation Settings
              </h3>
              <Button
                type='button'
                variant='outlineSecondary'
                size='sm'
                onClick={() =>
                  addVisit({
                    treatmentVisitName: "",
                    treatmentVisitDescription: "",
                    TreatmentVisitPrice: 0,
                    treatmentVisitEstimatedTime: "",
                  })
                }
              >
                <Plus className='mr-1 h-4 w-4' /> Add New Visit
              </Button>
            </div>
            <motion.div className='w-full space-y-6'>
              {formData.treatmentVisits?.map((visit, index) => (
                <div
                  key={index}
                  className='border-2 border-brand-neutrals/10 rounded-lg relative'
                >
                  <div className='px-4 py-1.5 bg-brand-neutrals/5 flex items-center justify-between w-full border-b border-brand-neutrals/10'>
                    <h4 className='font-medium text-brand-neutrals'>
                      Visit #{index + 1}
                    </h4>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className=''
                      onClick={() => removeVisit(index)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </div>

                  <div className='space-y-4 p-4'>
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name={`treatmentVisits.${index}.treatmentVisitName`}
                      label='Visit Name'
                      placeholder='Enter visit name'
                      onChange={(value) => {
                        updateVisit(index, {
                          treatmentVisitName: value as string,
                        });
                      }}
                    />

                    <CustomFormField
                      fieldType={FormFieldType.TEXTAREA}
                      control={form.control}
                      name={`treatmentVisits.${index}.treatmentVisitDescription`}
                      label='Visit Description'
                      placeholder='Enter visit description'
                      onChange={(value) => {
                        updateVisit(index, {
                          treatmentVisitDescription: value as string,
                        });
                      }}
                    />

                    <div className='flex gap-4'>
                      <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                        fieldType={FormFieldType.CURRENCY_INPUT}
                        control={form.control}
                        name={`treatmentVisits.${index}.TreatmentVisitPrice`}
                        label='Visit Price'
                        placeholder='Enter price'
                        currency='$'
                        onChange={(value) => {
                          updateVisit(index, {
                            TreatmentVisitPrice: Number(value),
                          });
                        }}
                      />

                      <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name={`treatmentVisits.${index}.treatmentVisitEstimatedTime`}
                        label='Estimated Time'
                        placeholder='Select estimated time'
                        className='rounded-xl'
                        options={
                          EstimatedTime?.map((time) => ({
                            value: time.value,
                            label: time.label,
                          })) || []
                        }
                        onChange={(value) => {
                          updateVisit(index, {
                            treatmentVisitEstimatedTime: value as string,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-5 w-full'>
            <div className='w-full flex items-center justify-between'>
              <h3 className='font-medium text-brand-neutrals'>
                Components Used
              </h3>
              <Button
                type='button'
                variant='outlineSecondary'
                size='sm'
                onClick={() => {
                  addComponent({
                    treatmentComponentsId: "",
                    quantity: 1,
                  });
                }}
                className=''
              >
                <Plus className='mr-1 h-4 w-4' /> Add Component
              </Button>
            </div>
            <div className='space-y-5'>
              {formData.treatmentComponents?.map((component, index) => (
                <>
                  <div
                    key={index}
                    className='py-3 w-full px-2 rounded-lg relative border-b-2 border-dashed border-brand-neutrals/20 pb-8'
                  >
                    <div className='mb-4' />

                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute top-2 right-2 block md:hidden'
                      onClick={() => removeComponent(index)}
                    >
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>

                    <div className='space-y-4 w-full'>
                      <div className='flex md:flex-nowrap flex-wrap gap-5 w-full justify-between items-center'>
                        <CustomFormField<z.infer<typeof AddTreatmentFormSchema>>
                          fieldType={FormFieldType.SELECT}
                          control={form.control}
                          name={`treatmentComponents.${index}.treatmentComponentsId`}
                          label='Component'
                          placeholder='Select component'
                          options={
                            components?.map((component) => ({
                              value: component.id,
                              label:
                                component.name + " - " + "$" + component.price,
                            })) || []
                          }
                          onChange={(value) => {
                            updateComponent(index, {
                              treatmentComponentsId: value as string,
                            });
                          }}
                        />

                        <div className='flex items-center gap-2'>
                          <CustomFormField<
                            z.infer<typeof AddTreatmentFormSchema>
                          >
                            fieldType={FormFieldType.NUMBER_INPUT}
                            control={form.control}
                            name={`treatmentComponents.${index}.quantity`}
                            label='Quantity'
                            defaultValue={1}
                            placeholder='Enter quantity'
                            onChange={(value) => {
                              updateComponent(index, {
                                quantity: Number(value),
                              });
                            }}
                          />

                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='mt-5 hidden md:block'
                            onClick={() => removeComponent(index)}
                          >
                            <Trash2 className='h-4 w-4 text-red-500' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
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
              {currentStep < 2 && currentStep !== 0 && (
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
                    "Add Treatment"
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

export default AddTreatmentDialog;
