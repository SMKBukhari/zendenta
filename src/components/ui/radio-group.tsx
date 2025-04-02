"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-4", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  children?: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-2'>
      <RadioGroupPrimitive.Item
        className={cn(
          "aspect-square h-4 w-4 rounded-full border-2 border-brand-neutrals/30",
          "data-[state=checked]:border-brand-primary-blue",
          "focus:outline-none focus: focus:ring-brand-primary-blue focus:ring-offset-2",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
          <CircleIcon className='h-2.5 w-2.5 fill-brand-primary-blue text-brand-primary-blue' />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {children}
    </div>
  );
}

export { RadioGroup, RadioGroupItem };
