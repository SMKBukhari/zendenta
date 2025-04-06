"use client";
import {
  Control,
  FieldValues,
  FieldPath,
  FieldPathValue,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { E164Number } from "libphonenumber-js/core";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Calendar from "@/icons/Calendar";
import { Minus, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

export enum FormFieldType {
  INPUT = "input",
  PASSWORD_INPUT = "passwordInput",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  CURRENCY_INPUT = "currencyInput",
  NUMBER_INPUT = "numberInput",
  SKELETON = "skeleton",
}

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  currency?: string;
  iconSrc?: string;
  icon?: React.ReactNode;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkelton?: (field: any) => React.ReactNode;
  fieldType?: FormFieldType;
  isForgotPassword?: boolean;
  onChange?: (value: FieldPathValue<T, FieldPath<T>>) => void;
  options?: { value: string; label: string }[];
  className?: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
}

interface RenderInputProps<T extends FieldValues> {
  field: {
    value: FieldPathValue<T, FieldPath<T>>;
    onChange: (value: FieldPathValue<T, FieldPath<T>>) => void;
    onBlur: () => void;
  };
  props: CustomFormFieldProps<T>;
}

const RenderInput = <T extends FieldValues>({
  field,
  props,
}: RenderInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const focusedColor = "#415be7";
  const defaultColor = "#515D6B";

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    field.onBlur();
  };

  const handleTextareaBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    field.onBlur();
  };

  const handleChange = (value: FieldPathValue<T, FieldPath<T>>) => {
    field.onChange(value);
    if (props.onChange) {
      props.onChange(value);
    }
  };

  const getIconWithColor = (icon: React.ReactNode) => {
    if (!icon) return null;
    return React.cloneElement(icon as React.ReactElement, {
      color: isFocused ? focusedColor : defaultColor,
    });
  };

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div
          className={`flex rounded-xl border-2 ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          } transition-all`}
        >
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              width={24}
              height={24}
              alt={props.iconAlt || "icon"}
              className='ml-2'
            />
          )}
          {props.icon && (
            <div className='flex items-center justify-center ml-2'>
              {getIconWithColor(props.icon)}
            </div>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              value={field.value as string}
              onChange={(e) =>
                handleChange(e.target.value as FieldPathValue<T, FieldPath<T>>)
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              defaultValue={props.defaultValue}
              className='shad-input'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PASSWORD_INPUT:
      return (
        <div
          className={`flex rounded-xl border-2 ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          } transition-all`}
        >
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              width={24}
              height={24}
              alt={props.iconAlt || "icon"}
              className='ml-2'
            />
          )}
          {props.icon && (
            <div className='flex items-center justify-center ml-2'>
              {getIconWithColor(props.icon)}
            </div>
          )}
          <FormControl>
            <Input
              placeholder={props.placeholder}
              type={showPassword ? "text" : "password"}
              value={field.value as string}
              onChange={(e) =>
                handleChange(e.target.value as FieldPathValue<T, FieldPath<T>>)
              }
              onFocus={handleFocus}
              defaultValue={props.defaultValue}
              onBlur={handleBlur}
              className='shad-input'
            />
          </FormControl>
          <Image
            src={`/assets/icons/${showPassword ? "hidden" : "visible"}.svg`}
            width={24}
            height={24}
            alt={showPassword ? "eye" : "eye slash"}
            className='mr-2 cursor-pointer'
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      );
    case FormFieldType.CURRENCY_INPUT:
      return (
        <div
          className={`flex rounded-xl border-2 ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          } transition-all items-center px-3`}
        >
          <span
            className={`text-xl ${
              isFocused ? "text-brand-primary-blue" : "text-brand-neutrals/50"
            }`}
          >
            {props.currency}
          </span>
          <FormControl>
            <Input
              placeholder={props.placeholder}
              value={field.value as number}
              type='number'
              onChange={(e) =>
                handleChange(e.target.value as FieldPathValue<T, FieldPath<T>>)
              }
              onFocus={handleFocus}
              onBlur={handleBlur}
              defaultValue={props.defaultValue}
              className='shad-input'
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <div
          className={`flex rounded-xl border-2 ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          } transition-all`}
        >
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              width={24}
              height={24}
              alt={props.iconAlt || "icon"}
              className='ml-2'
            />
          )}
          {props.icon && (
            <div className='flex items-center justify-center ml-2'>
              {getIconWithColor(props.icon)}
            </div>
          )}
          <FormControl>
            <Textarea
              placeholder={props.placeholder}
              value={field.value as string}
              onChange={(e) =>
                handleChange(e.target.value as FieldPathValue<T, FieldPath<T>>)
              }
              className='shad-textArea'
              disabled={props.disabled}
              onFocus={handleFocus}
              defaultValue={props.defaultValue}
              onBlur={handleTextareaBlur}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry='PK'
            placeholder={props.placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={(value) =>
              handleChange(value as FieldPathValue<T, FieldPath<T>>)
            }
            className='input-phone'
          />
        </FormControl>
      );
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className='flex items-center gap-4'>
            <Checkbox
              id={props.name}
              checked={field.value as boolean}
              onCheckedChange={(checked) => {
                handleChange(checked as FieldPathValue<T, FieldPath<T>>);
              }}
              className='checkbox'
            />
            <Label htmlFor={props.name} className='checkbox-label'>
              {props.label}
            </Label>
          </div>
        </FormControl>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div
          className={`flex rounded-xl border-2 transition-all ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          }`}
          onClick={handleFocus}
        >
          <div className='flex items-center justify-center ml-2'>
            {getIconWithColor(<Calendar />)}
          </div>
          <FormControl>
            <ReactDatePicker
              showTimeSelect={props.showTimeSelect ?? false}
              selected={field.value as Date}
              onChange={(date: Date | null) => {
                if (date) {
                  handleChange(date as FieldPathValue<T, FieldPath<T>>);
                } else {
                  handleChange(
                    null as unknown as FieldPathValue<T, FieldPath<T>>
                  );
                }
              }}
              timeInputLabel='Time:'
              dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
              wrapperClassName='date-picker'
              onFocus={handleFocus}
              onBlur={() => setIsFocused(false)}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <div
          className={`flex rounded-lg border-2 ${
            isFocused ? "border-brand-primary-blue" : "border-brand-neutrals/30"
          } transition-all ${props.className}`}
        >
          <FormControl>
            <Select
              value={field.value as string}
              onValueChange={(value) =>
                handleChange(value as FieldPathValue<T, FieldPath<T>>)
              }
              onOpenChange={(open) => setIsFocused(open)}
              defaultValue={props.defaultValue}
            >
              <SelectTrigger
                className='w-full shad-select-trigger'
                onClick={handleFocus}
              >
                <SelectValue placeholder={props.placeholder}>
                  {props.options?.find((opt) => opt.value === field.value)
                    ?.label || props.placeholder}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className='z-[99999999999999]'>
                {props.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER_INPUT:
      return (
        <div className='bg-brand-neutrals/5 w-32 flex items-center justify-center p-1 h-10 rounded-lg'>
          <div
            className='bg-white h-full flex items-center justify-center w-20 rounded-lg shadow-lg cursor-pointer text-brand-primary-blue/50'
            onClick={() => {
              const newValue = Math.max(1, (field.value as number) - 1);
              handleChange(newValue as FieldPathValue<T, FieldPath<T>>);
            }}
          >
            <Minus size={20} />
          </div>
          <FormControl>
            <Input
              value={field.value as number}
              type='number'
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                handleChange(value as FieldPathValue<T, FieldPath<T>>);
              }}
              onFocus={handleFocus}
              defaultValue={props.defaultValue}
              onBlur={handleBlur}
              className='w-full justify-center flex items-center text-center pl-5 bg-transparent border-0 shadow-none'
            />
          </FormControl>
          <div
            className='bg-white h-full flex items-center justify-center w-20 rounded-lg shadow-lg cursor-pointer text-brand-primary-blue'
            onClick={() => {
              const newValue = (field.value as number) + 1;
              handleChange(newValue as FieldPathValue<T, FieldPath<T>>);
            }}
          >
            <Plus size={20} />
          </div>
        </div>
      );
    case FormFieldType.SKELETON:
      return props.renderSkelton ? props.renderSkelton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = <T extends FieldValues>(
  props: CustomFormFieldProps<T>
) => {
  const { control, name, label } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex-1'>
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className='shad-input-label'>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className='shad-error' />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
