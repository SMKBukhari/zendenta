import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        isHired: true,
        role: "EMPLOYEE",
      },
      include: {
        workingHours: true,
        assignedTreatments: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error(`POST_STAFF_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
