import { NextResponse } from "next/server";
import crypto from "crypto";
import { compileOTPMail, sendMail } from "@/lib/emails/mail";
import prisma from "@/lib/prisma";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  if (!id) {
    return new NextResponse("Unauthorized", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Generate new OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const otpCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode, otpCodeExpiry },
  });

  const emailBody = await compileOTPMail(user.name, otpCode);

  await sendMail({
    to: user.email,
    subject: "Email Verification (Zendenta Dental Clinic)",
    body: emailBody,
  });

  return NextResponse.json({
    message: "OTP sent successfully",
  });
};
