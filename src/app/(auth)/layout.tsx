import Logo from "@/components/global/logo";
import Image from "next/image";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

function AuthLayout({ children }: Props) {
  return (
    <div className='flex w-full h-screen min-h-screen relative'>
      <section className='remove-scrollbar container my-auto'>
        <div className={`sub-container max-w-[350px]`}>
          <div className='flex justify-center'>
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          <div className='mt-10'>{children}</div>

          <div className='md:mt-10 mt-5 flex justify-center gap-1'>
            <p className='text-center text-xs text-primary-blue-500'>
              Powered by
            </p>
            <Link href='https://endvor.net' className='' target='_blank'>
              <Image
                src={"/assets/images/endvorLogo.svg"}
                alt='Endvor Logo'
                width={50}
                height={50}
              />
            </Link>
          </div>
        </div>
      </section>

      <Image
        src='/assets/images/onboarding-img.jpg'
        height={1000}
        width={1000}
        alt='patient'
        className='side-img max-w-[50%] z-50'
      />
    </div>
  );
}

export default AuthLayout;
