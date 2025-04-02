import StethoScope from "@/icons/StethoScope";
import { TreatmentsArray } from "@/types";
import React from "react";

interface AdminTreatmentsProps {
  treatments: TreatmentsArray | null;
}
const InactiveTreatments = ({ treatments }: AdminTreatmentsProps) => {
  const treatmentsArray = Array.isArray(treatments) ? treatments : [];
  const inactiveTreatments = treatmentsArray.filter(
    (treatment) => !treatment.isActive
  );
  return (
    <div>
      <div className='w-full'>
        <div className='w-full flex items-center gap-2'>
          <div className='bg-brand-neutrals/5 p-1 rounded-md'>
            <StethoScope width='22' />
          </div>
          <div>
            <h2>
              {inactiveTreatments.length === 0
                ? "No Inactive Treatment"
                : `${inactiveTreatments.length} ${
                    inactiveTreatments.length === 1 ? "Treatment" : "Treatments"
                  }`}
            </h2>
          </div>
        </div>

        {/* Render inactive treatments list */}
        <div className='mt-4'>
          {inactiveTreatments.map((treatment) => (
            <div key={treatment.id} className='p-3 border rounded-lg mt-2'>
              <h3 className='font-medium'>{treatment.name}</h3>
              <p className='text-sm text-gray-600'>{treatment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InactiveTreatments;
