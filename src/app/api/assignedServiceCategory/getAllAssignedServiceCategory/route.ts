import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const category = await prisma.treatmentCategory.findMany({
      include: {
        treatments: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(`POST_ASSIGNED_SERVICE_CATEGORY_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
