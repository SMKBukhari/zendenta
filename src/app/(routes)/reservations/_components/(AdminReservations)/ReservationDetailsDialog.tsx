"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import {
  Reservation,
  Treatment,
  User,
  MedicalCheckup,
  DentalRecord,
} from "@prisma/client";
import { useState } from "react";
import MedicalCheckupForm from "./MedicalCheckupForm";
import Dialog from "@/components/global/CustomDialog";
import { ReservationWithRelations } from "@/types";

interface ReservationDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationWithRelations | null;
  onMedicalCheckupComplete: () => void;
}

const ReservationDetailsDialog = ({
  isOpen,
  onClose,
  reservation,
  onMedicalCheckupComplete,
}: ReservationDetailsDialogProps) => {
  const [showMedicalCheckup, setShowMedicalCheckup] = useState(false);
  

  if (showMedicalCheckup && reservation) {
    return (
      <MedicalCheckupForm
        isOpen={isOpen}
        onClose={() => {
          setShowMedicalCheckup(false);
          onClose();
        }}
        reservation={reservation}
        onComplete={() => {
          setShowMedicalCheckup(false);
          onMedicalCheckupComplete();
        }}
      />
    );
  }

  if (!reservation) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Reservation #${reservation.id.slice(0, 8).toUpperCase()}`}
      size='lg'
    >
      <div className='space-y-6'>
        {/* Patient Information */}
        <div className='space-y-4'>
          <h3 className='font-medium text-lg'>Patient Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Full Name</p>
              <p className='font-medium'>{reservation.user.name}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Age</p>
              <p className='font-medium'>
                {reservation.user.birthDate
                  ? new Date().getFullYear() -
                    new Date(reservation.user.birthDate).getFullYear()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Gender</p>
              <p className='font-medium capitalize'>
                {reservation.user.gender?.toLowerCase()}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Phone Number</p>
              <p className='font-medium'>{reservation.user.phoneNumber}</p>
            </div>
            <div className='col-span-2'>
              <p className='text-sm text-muted-foreground'>Email</p>
              <p className='font-medium'>{reservation.user.email}</p>
            </div>
            <div className='col-span-2'>
              <p className='text-sm text-muted-foreground'>Address</p>
              <p className='font-medium'>{reservation.user.address}</p>
            </div>
          </div>
        </div>

        {/* Treatment Information */}
        <div className='space-y-4'>
          <h3 className='font-medium text-lg'>Treatment Information</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Treatment</p>
              <p className='font-medium'>{reservation.treatment.name}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Dentist</p>
              <p className='font-medium'>Drg. {reservation.dentist.name}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Date & Time</p>
              <p className='font-medium'>
                {format(
                  new Date(reservation.dateTime || `${reservation.date}T${reservation.time}`),
                  "EEE, d MMM yyyy hh:mm a"
                )}
              </p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Status</p>
              <Badge
                variant={
                  reservation.status === "FINISHED"
                    ? "brandPrimary" // or another existing variant
                    : reservation.status === "REGISTERED"
                    ? "default"
                    : reservation.status === "DOING_TREATMENT"
                    ? "brandSecondary" // or another existing variant
                    : "destructive"
                }
              >
                {reservation.status}
              </Badge>
            </div>
            <div className='col-span-2'>
              <p className='text-sm text-muted-foreground'>Quick Note</p>
              <p className='font-medium'>
                {reservation.quickNote || "No notes provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Medical Checkup Status */}
        {reservation.medicalCheckup ? (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg'>Medical Checkup</h3>
            <div className='bg-green-50 p-4 rounded-lg border border-green-200'>
              <p className='text-green-700'>
                Medical checkup completed on{" "}
                {format(
                  new Date(reservation.medicalCheckup.createdAt),
                  "MMM d, yyyy"
                )}
              </p>
              <p className='text-sm text-green-600 mt-2'>
                {reservation.medicalCheckup.dentalRecords.length} dental records
                added
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-4'>
            <h3 className='font-medium text-lg'>Medical Checkup</h3>
            <div className='bg-yellow-50 p-4 rounded-lg border border-yellow-200'>
              <p className='text-yellow-700'>
                Medical checkup not completed yet
              </p>
              <Button
                className='mt-3'
                onClick={() => setShowMedicalCheckup(true)}
              >
                Add Medical Checkup
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default ReservationDetailsDialog;
