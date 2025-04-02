import { LogOut, Settings, UserRoundPen } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { User } from "@prisma/client";
import { useSigninStore } from "@/store/useSigninStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditUser from "@/icons/EditUser";
import { BasicRoutes } from "@/lib/constants";

interface UserPopoverProps {
  userProfile: User | null;
}

const UserPopover = ({ userProfile }: UserPopoverProps) => {
  const [hoveredItem, setHoveredItem] = useState<{
    routeIndex: number;
  } | null>(null);
  const pathName = usePathname();

  const isActive = (url: string) => pathName === url;

  const avatarFallback = userProfile?.name?.substring(0, 2).toUpperCase();

  const { reset } = useSigninStore();

  //   Get the first two words of the user profile fullname
  const profileName =
    userProfile?.name?.split(" ")[0] + " " + userProfile?.name?.split(" ")[1];

  const { resolvedTheme } = useTheme();

  const userImage = () => {
    if (resolvedTheme === "dark") {
      return "/img/user_dark.png";
    } else {
      return "/img/user_light.png";
    }
  };
  const router = useRouter();
  const handleSignOut = () => {
    // Clear session data
    reset();
    router.push("/sign-in");
    toast.success("Signed out successfully");
  };

  return (
    <div className='flex flex-col gap-2.5'>
      <div className='flex gap-2 items-center'>
        {userProfile?.imageUrl ? (
          <Avatar>
            <AvatarImage
              className='w-full object-cover object-center'
              src={userProfile.imageUrl}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className='border-brand-neutrals/30 border bg-brand-neutrals/5'>
            <AvatarImage
              className='w-full object-cover object-center'
              src={userImage()}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
        <div>
          <h2 className='font-medium md:text-sm text-xs text-brand-neutrals'>
            {profileName}
          </h2>
          <h3 className='text-brand-neutrals/70 font-medium md:text-xs text-[10px]'>
            {userProfile?.email}
          </h3>
        </div>
      </div>
      <Separator className='bg-brand-neutrals/20' />
      {BasicRoutes.map((route, index) => {
        const isHovered = hoveredItem?.routeIndex === index;
        return (
          <Link
            key={index}
            href={route.path}
            className={`rounded-lg px-3 py-1.5 transition-all text-brand-neutrals font-medium  hover:bg-brand-light-blue/15 hover:text-brand-primary-blue hover:font-medium ${
              isActive(route.path) &&
              "bg-brand-light-blue/15 text-brand-primary-blue font-medium"
            }`}
            onMouseEnter={() => setHoveredItem({ routeIndex: index })}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className='flex items-center'>
              <route.icon
                color={isActive(route.path) || isHovered ? "#415be7" : ""}
              />
              <span className='ml-2 text-sm'>{route.name}</span>
            </div>
          </Link>
        );
      })}
      <Button
        variant={"ghost"}
        className='flex gap-2 rounded-lg px-3 py-1.5 items-center hover:bg-brand-primary-pink/20 justify-start text-[#d31510] hover:text-[#d31510]'
        onClick={handleSignOut}
      >
        <div className='flex items-center ml-1.5'>
          <LogOut size={20} />
          <span className='ml-2 text-sm'>Sign out</span>
        </div>
      </Button>
    </div>
  );
};

export default UserPopover;
