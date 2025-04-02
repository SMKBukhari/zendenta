import { redirect } from "next/navigation";
import OTPInput from "./_components/otpInput";
import prisma from "@/lib/prisma";

const VerifyAccount = async ({ params }: { params: { id: string } }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
      isVerified: false,
    },
  });

  if (!user) {
    return redirect("/signIn");
  }

  return (
    <div className=''>
      <OTPInput userId={user?.id ?? ""} />
    </div>
  );
};

export default VerifyAccount;
