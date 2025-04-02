"use client";
import { Button } from "@/components/ui/button";
import { useKBar } from "kbar";
import { Search } from "lucide-react";

export default function SearchInput() {
  const { query } = useKBar();

  // const handleSearch = () => {
  //   if (kbar.query?.toggle) {
  //     kbar.query.toggle()
  //   }
  // }

  return (
    <div className='w-full space-y-2'>
      <Button
        variant='outline'
        className='relative bg-brand-primary-light-neutrals hover:bg-brand-primary-light-neutrals h-9 w-full justify-start items-center text-sm font-normal text-brand-neutrals/70 shadow-none sm:pr-12 md:w-40 lg:w-64 rounded-full outline-none'
        onClick={query.toggle}
      >
        <Search className='h-5 w-5 text-brand-neutrals/80 font-medium' />
        <span className='text-brand-neutrals/70'>Search for anything...</span>
      </Button>
    </div>
  );
}
