"use client";
import { DataTable } from "@/components/global/CustomDataTable";
import Dialog from "@/components/global/CustomDialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Staff from "@/icons/Staff";
import { StaffArray } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { columns } from "./_components/columns";
import AddStaffDialog from "./AddStaffDialog";

interface AdminStaffProps {
  staff: StaffArray | null;
}

const AdminStaff = ({ staff }: AdminStaffProps) => {
  const staffArray = Array.isArray(staff) ? staff : [];
  const [isOpened, setIsOpened] = useState(false);
  const isMobile = useIsMobile();

  const formattedStaff = staffArray.map((staff) => {
    return {
      id: staff.id ?? "N/A",
      staffName: staff.name ?? "N/A",
      contactNo: staff.phoneNumber ?? "N/A",
      email: staff.email ?? "N/A",
      jobType: staff.jobType ?? "N/A",
    };
  });
  return (
    <div>
      <div className='mt-5'>
        <div>
          <div className='border-b-2 border-brand-neutrals/20'>
            <div className='w-full p-3 pb-10'>
              <div className='w-full flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='bg-brand-light-blue/15 p-1 rounded-md'>
                    <Staff width='22' color='#415be7' />
                  </div>
                  <div>
                    <h2 className='font-bold text-brand-neutrals'>
                      {staffArray.length === 0
                        ? "No Doctor Hired"
                        : `${staffArray.length} ${
                            staffArray.length === 1 ? "Doctor" : "Doctors"
                          }`}
                    </h2>
                  </div>
                </div>

                <Button
                  className='self-end'
                  variant={"primary"}
                  onClick={() => {
                    setIsOpened(true);
                  }}
                >
                  <Plus size={20} />
                  Add Doctor
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-6 w-full'>
            <DataTable columns={columns} data={formattedStaff} />
          </div>

          <Dialog
            isOpen={isOpened}
            onClose={() => {
              setIsOpened(false);
            }}
            title='Add New Staff'
            size={isMobile ? "sm" : "md"}
            position={isMobile ? "center" : "right"}
          >
            <AddStaffDialog />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AdminStaff;
