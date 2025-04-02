import Image from "next/image";

const Logo = () => {
  return (
    <div className='flex items-center justify-center'>
      <Image
        src='/assets/icons/zendenta.png'
        height={1000}
        width={1000}
        alt='patient'
        className='md:h-20 md:w-20 h-16 w-16'
      />
      <h1 className='md:text-5xl text-4xl font-bold'>Zendenta</h1>
    </div>
  );
};

export default Logo;
