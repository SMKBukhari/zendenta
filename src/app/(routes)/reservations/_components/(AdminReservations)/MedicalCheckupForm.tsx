"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Reservation,
  Treatment,
  User,
  MedicalCheckup,
  DentalRecord,
} from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import TeethSelection from "./TeethSelection";
import OralCheckQuestions from "./OralCheckQuestions";
import axios from "axios";
import { toast } from "sonner";
import Dialog from "@/components/global/CustomDialog";
import { ReservationWithRelations } from "@/types";

const medicalCheckupSchema = z.object({
  bloodPressure: z.string().min(1, "Blood pressure is required"),
  sicknesses: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
});

interface MedicalCheckupFormProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationWithRelations;
  onComplete: () => void;
}

const MedicalCheckupForm = ({
  isOpen,
  onClose,
  reservation,
  onComplete,
}: MedicalCheckupFormProps) => {
  const [step, setStep] = useState<"medical" | "teeth" | "oral">("medical");
  const [selectedTeeth, setSelectedTeeth] = useState<DentalRecord[]>([]);

  const form = useForm<z.infer<typeof medicalCheckupSchema>>({
    resolver: zodResolver(medicalCheckupSchema),
    defaultValues: {
      bloodPressure: "",
      sicknesses: [],
      allergies: [],
    },
  });

  const handleNext = () => {
    if (step === "medical") {
      setStep("teeth");
    } else if (step === "teeth") {
      setStep("oral");
    }
  };

  const handleBack = () => {
    if (step === "teeth") {
      setStep("medical");
    } else if (step === "oral") {
      setStep("teeth");
    }
  };

  const onSubmit = async (data: z.infer<typeof medicalCheckupSchema>) => {
    try {
      // Prepare dental records data
      const dentalRecordsData = selectedTeeth.map((record) => ({
        toothNumber: record.toothNumber,
        toothName: record.toothName,
        teethConditionId: record.teethConditionId,
        treatmentId: record.treatmentId,
        note: record.note,
        isRecommended: record.isRecommended,
        isApproved: record.isApproved,
        notApprovedReason: record.notApprovedReason,
        isDone: record.isDone,
        notDoneReason: record.notDoneReason,
      }));

      // Prepare medical checkup data
      const medicalCheckupData = {
        reservationId: reservation.id,
        bloodPressure: data.bloodPressure,
        sicknesses: data.sicknesses || [],
        allergies: data.allergies || [],
        dentalRecords: dentalRecordsData,
      };

      // Submit to API
      await axios.post("/api/medical-checkup", medicalCheckupData);

      toast.success("Medical checkup completed successfully");
      onComplete();
    } catch (error) {
      console.error("Error submitting medical checkup:", error);
      toast.error("Failed to complete medical checkup");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Medical Checkup - ${reservation.user?.name}`}
      size='xl'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "medical" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                1
              </div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "teeth"
                    ? "bg-blue-500 text-white"
                    : step === "oral"
                    ? "bg-gray-200"
                    : "bg-gray-100"
                }`}
              >
                2
              </div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === "oral" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                3
              </div>
            </div>
          </div>

          <AnimatePresence mode='wait'>
            {step === "medical" && (
              <motion.div
                key='medical'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className='space-y-4'
              >
                <h3 className='font-medium text-lg'>Medical Information</h3>

                <FormField
                  control={form.control}
                  name='bloodPressure'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. 120/80' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Particular Sickness</FormLabel>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    {[
                      "Heart Disease",
                      "Diabetes",
                      "Hypertension",
                      "Asthma",
                    ].map((sickness) => (
                      <div
                        key={sickness}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type='checkbox'
                          id={sickness}
                          checked={
                            form.watch("sicknesses")?.includes(sickness) ||
                            false
                          }
                          onChange={(e) => {
                            const sicknesses =
                              form.getValues("sicknesses") || [];
                            if (e.target.checked) {
                              form.setValue("sicknesses", [
                                ...sicknesses,
                                sickness,
                              ]);
                            } else {
                              form.setValue(
                                "sicknesses",
                                sicknesses.filter((s) => s !== sickness)
                              );
                            }
                          }}
                        />
                        <label htmlFor={sickness}>{sickness}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <FormLabel>Allergies</FormLabel>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    {[
                      "Penicillin",
                      "Latex",
                      "Local Anesthetics",
                      "Aspirin",
                    ].map((allergy) => (
                      <div
                        key={allergy}
                        className='flex items-center space-x-2'
                      >
                        <input
                          type='checkbox'
                          id={allergy}
                          checked={
                            form.watch("allergies")?.includes(allergy) || false
                          }
                          onChange={(e) => {
                            const allergies = form.getValues("allergies") || [];
                            if (e.target.checked) {
                              form.setValue("allergies", [
                                ...allergies,
                                allergy,
                              ]);
                            } else {
                              form.setValue(
                                "allergies",
                                allergies.filter((a) => a !== allergy)
                              );
                            }
                          }}
                        />
                        <label htmlFor={allergy}>{allergy}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === "teeth" && (
              <motion.div
                key='teeth'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TeethSelection
                  treatment={reservation.treatment}
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                />
              </motion.div>
            )}

            {step === "oral" && (
              <motion.div
                key='oral'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OralCheckQuestions />
              </motion.div>
            )}
          </AnimatePresence>

          <div className='flex justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={step === "medical" ? onClose : handleBack}
            >
              {step === "medical" ? "Cancel" : "Back"}
            </Button>

            {step === "oral" ? (
              <Button type='submit'>Complete Medical Checkup</Button>
            ) : (
              <Button type='button' onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Dialog>
  );
};

export default MedicalCheckupForm;
