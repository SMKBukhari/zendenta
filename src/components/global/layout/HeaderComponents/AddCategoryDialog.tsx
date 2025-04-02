"use client";
import { Form } from "@/components/ui/form";
import { stepVariants } from "@/lib/constants";
import { AddCategoryFormSchema } from "@/schemas";
import { useAddCategoryStore } from "@/store/useAddCategoryStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomFormField, { FormFieldType } from "../../auth/CustomFormField";
import Dialog, { useDialog } from "../../CustomDialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AddCategoryDialog = () => {
  const { onClose } = useDialog();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { categoryName, reset, setCategoryName } = useAddCategoryStore();

  const form = useForm<z.infer<typeof AddCategoryFormSchema>>({
    resolver: zodResolver(AddCategoryFormSchema),
    defaultValues: {
      name: categoryName,
    },
  });

  const onSubmit = async (data: z.infer<typeof AddCategoryFormSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/categories/create", data);
      toast.success(response.data.category.name, {
        description: "Category added successfully",
      });
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='xl:space-y-6 space-y-4 flex flex-col h-full justify-between'
      >
        <div className='flex-1 overflow-y-auto px-4'>
          <AnimatePresence mode='wait'>
            <motion.div
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
              <div className='space-y-5 w-full'>
                <div className='w-full space-y-6'>
                  <CustomFormField<z.infer<typeof AddCategoryFormSchema>>
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name='name'
                    label='Category Name'
                    placeholder='Enter category name'
                    onChange={(value) => {
                      setCategoryName(value as string);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Dialog.Footer>
          <Button
            variant='outline'
            type='button'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit' variant={"primary"} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className='w-6 h-6 animate-spin' />
            ) : (
              "Add Category"
            )}
          </Button>
        </Dialog.Footer>
      </form>
    </Form>
  );
};

export default AddCategoryDialog;
