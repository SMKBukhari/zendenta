"use client";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { User } from "@prisma/client";
import { getPageTitle } from "@/lib/utils";
import SearchInput from "./HeaderComponents/search-input";
import UserNavButton from "./HeaderComponents/user-nav";
import AddButton from "./HeaderComponents/AddButton";
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  userProfile: User | null;
}

const Header = ({ userProfile }: HeaderProps) => {
  const path = usePathname();
  const isMobile = useIsMobile();
  const pageTitle = getPageTitle(path);

  // Function to get the page title based on the current route

  return (
    <header className='flex h-16 md:px-6 px-2 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white border-b border-brand-neutrals/20 shadow-xs'>
      <div className='flex items-center gap-2'>
        {isMobile && (
          <SidebarTrigger className='bg-white hover:bg-white shadow-2xl rounded-full border border-brand-neutrals/15' />
        )}
        <h1 className='md:text-2xl text-sm text-brand-neutrals font-medium'>
          {pageTitle}
        </h1>
      </div>

      <div className='flex items-center gap-2 gap-x-5 px-4 h-full'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        {/* <BellNotification user={userProfile} notifications={notifications} /> */}
        <div className='flex items-center gap-5 h-full'>
          <AddButton />
          <Separator
            orientation='vertical'
            className='bg-brand-neutrals/20 data-[orientation=vertical]:w-[2px] data-[orientation=vertical]:h-[45%]'
          />
          <UserNavButton userProfile={userProfile} />
        </div>
      </div>
    </header>
  );
};

export default Header;
