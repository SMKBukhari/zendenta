import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    const userProfile = await prisma.user.findFirst({
      where: { id },
      include: { clinic: true },
    });

    if (!userProfile) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error(`GET_USER_PROFILE_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
