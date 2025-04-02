"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  spanLabel: string;
  label: string;
  href: string;
}

export const BackButton = ({ spanLabel, label, href }: BackButtonProps) => {
  return (
    <div className='flex w-full justify-center items-center -mt-1.5'>
      <span className='text-sm font-normal text-muted-foreground'>
        {spanLabel}
      </span>
      <Button
        variant={"link"}
        className='font-base text-brand-primary-blue -ml-2 underline'
        size={"sm"}
        asChild
      >
        <Link href={href} className=''>
          {label}
        </Link>
      </Button>
    </div>
  );
};
