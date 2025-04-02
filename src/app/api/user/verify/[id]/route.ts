import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
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

    const { otpCode } = await req.json();

    if (!otpCode) {
      return new NextResponse("OTP is required", { status: 400 });
    }

    if (user.otpCode !== otpCode) {
      return new NextResponse("Invalid OTP", { status: 400 });
    }

    if (user.otpCodeExpiry && new Date() > new Date(user.otpCodeExpiry)) {
      return new NextResponse("OTP has expired!", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
      },
    });

    return NextResponse.json({ updatedUser });
  } catch (error) {
    console.log(`[OTP_PATCH]: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
