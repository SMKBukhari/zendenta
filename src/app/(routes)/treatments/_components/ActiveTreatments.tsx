"use client";
import Dialog from "@/components/global/CustomDialog";
import { Button } from "@/components/ui/button";
import StethoScope from "@/icons/StethoScope";
import { TreatmentsArray } from "@/types";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddTreatmentDialog from "./AddTreatmentDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { TreatmentCategory, TreatmentComponents } from "@prisma/client";
import { DataTable } from "@/components/global/CustomDataTable";
import { columns } from "./_components/columns";

interface AdminTreatmentsProps {
  treatments: TreatmentsArray | null;
  categories: TreatmentCategory[] | null;
  components: TreatmentComponents[] | null;
}

const ActiveTreatments = ({
  treatments,
  categories,
  components,
}: AdminTreatmentsProps) => {
  const treatmentsArray = Array.isArray(treatments) ? treatments : [];
  const isMobile = useIsMobile();
  const [isOpened, setIsOpened] = useState(false);

  const activeTreatments = treatmentsArray.filter(
    (treatment) => treatment.isActive
  );

  const formattedTreatments = activeTreatments.map((treatment) => {
    // Calculate average rating if reviews exist
    let ratingDisplay = "No Rating";
    if (treatment.treatmentReviews && treatment.treatmentReviews.length > 0) {
      const totalRating = treatment.treatmentReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating = totalRating / treatment.treatmentReviews.length;
      ratingDisplay = averageRating.toFixed(1); // Format to one decimal place
    }

    // Determine review count display
    const reviewCount = treatment.treatmentReviews?.length || 0;
    const reviewDisplay =
      reviewCount === 0
        ? "0 Review(s)"
        : `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`;

    return {
      id: treatment.id ?? "N/A",
      treatmentName: treatment.name ?? "N/A",
      price: treatment.price ?? 0, // Changed to number (0 as fallback)
      estimateDuration: treatment.estimateDuration ?? "N/A",
      typeOfVisit:
        treatment.treatmentVisit.length > 1 ? "MULTIPLE VISIT" : "SINGLE VISIT",
      rating: ratingDisplay,
      review: reviewDisplay, // Changed from 'review' to 'reviews'
    };
  });
  return (
    <div>
      <div className='border-b-2 border-brand-neutrals/20'>
        <div className='w-full p-3 pb-10'>
          <div className='w-full flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <div className='bg-brand-light-blue/15 p-1 rounded-md'>
                <StethoScope width='22' color='#415be7' />
              </div>
              <div>
                <h2 className='font-bold text-brand-neutrals'>
                  {activeTreatments.length === 0
                    ? "No Active Treatment"
                    : `${activeTreatments.length} ${
                        activeTreatments.length === 1
                          ? "Treatment"
                          : "Treatments"
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
              Add Treatment
            </Button>
          </div>
        </div>
      </div>

      <div className='mt-6 w-full'>
        <DataTable columns={columns} data={formattedTreatments} />
      </div>

      <Dialog
        isOpen={isOpened}
        onClose={() => {
          setIsOpened(false);
        }}
        title='Add Treatment'
        size={isMobile ? "sm" : "md"}
        position={isMobile ? "center" : "right"}
      >
        <AddTreatmentDialog categories={categories} components={components} />
      </Dialog>
    </div>
  );
};

export default ActiveTreatments;
