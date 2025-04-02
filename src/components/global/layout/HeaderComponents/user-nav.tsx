"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import UserPopover from "./UserPopover";
import { useIsMobile } from "@/hooks/use-mobile";

interface UserNavButtonProps {
  userProfile: User | null;
}

const UserNavButton = ({ userProfile }: UserNavButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { resolvedTheme } = useTheme();

  const avatarFallback = userProfile?.name?.substring(0, 2).toUpperCase();

  const userImage = () => {
    if (resolvedTheme === "dark") {
      return "/img/user_dark.png";
    } else {
      return "/img/user_light.png";
    }
  };

  const chevronIcon = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Popover onOpenChange={chevronIcon}>
      <PopoverTrigger className='flex items-center gap-2'>
        {isMobile && (
          <>
            {userProfile?.imageUrl ? (
              <Avatar>
                <AvatarImage
                  className='object-cover w-full h-full object-center'
                  src={userProfile.imageUrl}
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className='border-brand-neutrals/30 border bg-brand-neutrals/5'>
                <AvatarImage src={userImage()} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            )}
            <div className='ml-1'>
              {isOpen ? (
                <ChevronUp className='w-4 h-4' />
              ) : (
                <ChevronDown className='w-4 h-4' />
              )}
            </div>
          </>
        )}
        {!isMobile && (
          <>
            <div className='flex items-center gap-3 cursor-pointer'>
              <div>
                {userProfile?.imageUrl ? (
                  <Avatar>
                    <AvatarImage
                      className='object-cover w-full h-full object-center'
                      src={userProfile.imageUrl}
                    />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar className='border-brand-neutrals/30 border bg-brand-neutrals/5'>
                    <AvatarImage src={userImage()} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className='flex flex-col items-start'>
                <h2 className='font-medium text-sm text-brand-neutrals'>
                  {userProfile?.name}
                </h2>
                <h3 className='text-brand-neutrals/70 font-medium text-xs'>
                  {userProfile?.email}
                </h3>
              </div>
              <div className='ml-3'>
                {isOpen ? (
                  <ChevronUp className='w-4 h-4' />
                ) : (
                  <ChevronDown className='w-4 h-4' />
                )}
              </div>
            </div>
          </>
        )}
      </PopoverTrigger>
      <PopoverContent className='md:w-64 w-52 bg-white border-brand-neutrals/10 border-2 rounded-lg'>
        <UserPopover userProfile={userProfile} />
      </PopoverContent>
    </Popover>
  );
};

export default UserNavButton;
