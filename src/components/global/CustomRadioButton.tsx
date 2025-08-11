"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface OptionType {
  label: string;
  value: string;
}

interface RadioButtonProps {
  options: string[] | OptionType[];
  name: string;
  onChange?: (value: string | null) => void;
  value?: string | null;
  field?: ControllerRenderProps<FieldValues, string>;
  label?: string;
  className?: string;
}

export default function RadioButtonGroup({
  options,
  name,
  onChange,
  value: propValue,
  field,
  label,
  className = "",
}: RadioButtonProps) {
  const normalizedOptions =
    options?.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    ) || [];

  const [selected, setSelected] = useState<string | null>(
    field?.value || propValue || null
  );

  useEffect(() => {
    if (propValue !== undefined) {
      setSelected(propValue);
    }
  }, [propValue]);

  useEffect(() => {
    if (field?.value !== undefined) {
      setSelected(field.value);
    }
  }, [field?.value]);

  const handleSelect = (value: string) => {
    const newValue = selected === value ? null : value;
    setSelected(newValue);

    // Update form state
    if (field) {
      field.onChange(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <FormItem className={`space-y-3 ${className}`}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <div className='flex space-x-1 h-11'>
          {normalizedOptions.map((option) => (
            <Label
              key={option.value}
              className={`cursor-pointer ${className} flex items-center px-3 py-2 rounded-xl border transition-all ${
                selected === option.value
                  ? "border-brand-primary-blue bg-white"
                  : "border-brand-neutrals/30 text-brand-neutrals bg-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(option.value);
              }}
            >
              <Input
                type='radio'
                name={name}
                value={option.value}
                checked={selected === option.value}
                onChange={() => {}} // Empty handler - we handle clicks on the Label
                className='hidden'
              />
              <div
                className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-0 transition-all ${
                  selected === option.value
                    ? "bg-brand-primary-blue border-brand-primary-blue"
                    : "border-gray-400"
                }`}
              >
                {selected === option.value && (
                  <div className='w-2.5 h-2.5 bg-white rounded-full'></div>
                )}
              </div>
              {option.label}
            </Label>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
