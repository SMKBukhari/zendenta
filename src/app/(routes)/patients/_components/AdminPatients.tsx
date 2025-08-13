"use client";
import { DataTable } from "@/components/global/CustomDataTable";
import Dialog from "@/components/global/CustomDialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import UserCircle from "@/icons/UserCircle";
import type { PatientsArray } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { columns } from "./columns";
import AddPatientDialog from "./AddPatientDialog";

interface AdminPatientsProps {
  patients: PatientsArray | null;
}

const AdminPatients = ({ patients }: AdminPatientsProps) => {
  const patientsArray = Array.isArray(patients) ? patients : [];
  const [isOpened, setIsOpened] = useState(false);
  const isMobile = useIsMobile();

  const formattedPatients = patientsArray.map((patient) => ({
    id: patient.id,
    patientName: patient.name,
    contactNo: patient.phoneNumber,
    email: patient.email,
    status: patient.patientRecord?.status || "ACTIVE",
    primaryDentist:
      patient.patientRecord?.primaryDentist?.name || "Not assigned",
    createdBy: patient.patientRecord?.createdBy.name || "System",
    lastVisit: patient.patientRecord?.updatedAt.toLocaleDateString() || "Never",
    medicalHistoryCount: patient.patientRecord?.medicalHistory.length || 0,
  }));

  return (
    <div>
      <div className='mt-5'>
        <div>
          <div className='border-b-2 border-brand-neutrals/20'>
            <div className='w-full p-3 pb-10'>
              <div className='w-full flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-brand-light-blue/15 p-1 rounded-md'>
                    <UserCircle />
                  </div>
                  <div>
                    <h2 className='font-bold text-brand-neutrals'>
                      {patientsArray.length === 0
                        ? "No Patients"
                        : `${patientsArray.length} ${
                            patientsArray.length === 1 ? "Patient" : "Patients"
                          }`}
                    </h2>
                  </div>
                </div>

                <Button
                  className='self-end'
                  variant={"primary"}
                  onClick={() => setIsOpened(true)}
                >
                  <Plus size={20} />
                  Add Patient
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-6 w-full'>
            <DataTable columns={columns} data={formattedPatients} />
          </div>

          <Dialog
            isOpen={isOpened}
            onClose={() => setIsOpened(false)}
            title='Add New Patient'
            size={isMobile ? "sm" : "md"}
            position={isMobile ? "center" : "right"}
          >
            <AddPatientDialog />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
