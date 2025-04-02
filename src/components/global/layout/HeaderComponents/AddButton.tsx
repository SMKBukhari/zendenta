"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AddButtons } from "@/lib/constants";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import Dialog from "../../CustomDialog";
import AddCategoryDialog from "./AddCategoryDialog";
import AddComponentDialog from "./AddComponentDialog";

type Props = {};

const AddButton = (props: Props) => {
  const [hoveredItem, setHoveredItem] = useState<{
    routeIndex: number;
  } | null>(null);
  const [openedDialog, setOpenedDialog] = useState<number | null>(null);

  const handleDialogClose = () => {
    setOpenedDialog(null);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className='rounded-full bg-brand-primary-blue p-1 text-white cursor-pointer w-9 h-9 flex items-center justify-center'>
            <Plus className='w-8 h-7' />
          </div>
        </PopoverTrigger>
        <PopoverContent className='bg-white border-brand-neutrals/10 border-2 rounded-lg w-50 p-2'>
          <div className='flex flex-col w-full items-start'>
            {AddButtons.map((button, index) => {
              const isHovered = hoveredItem?.routeIndex === index;
              return (
                <Button
                  key={index}
                  variant='ghost'
                  className={`rounded-lg px-3 py-1.5 transition-all text-brand-neutrals font-medium  hover:bg-brand-light-blue/15 hover:text-brand-primary-blue hover:font-medium w-full justify-start`}
                  onMouseEnter={() => setHoveredItem({ routeIndex: index })}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => setOpenedDialog(index)}
                >
                  <div className='flex items-center'>
                    <button.icon color={isHovered ? "#415be7" : ""} />
                    <span className='ml-2 text-sm'>{button.name}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {/* Render dialogs based on which button was clicked */}
      {AddButtons.map((button, index) => (
        <Dialog
          key={index}
          isOpen={openedDialog === index}
          onClose={handleDialogClose}
          title={button.name}
          size='md'
          position='right'
        >
          {index === 0 && "This is the form for adding a new patient."}
          {index === 1 && "This is the form for adding a new appointment."}
          {index === 2 && "This is the form for adding a new treatment."}
          {index === 3 && <AddComponentDialog />}
          {index === 4 && <AddCategoryDialog />}
        </Dialog>
      ))}
    </div>
  );
};

export default AddButton;
