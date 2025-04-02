import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const treatments = await prisma.treatment.findMany({
      include: {
        treatmentVisit: true,
        treatmentCategory: true,
        treatmentReviews: true,
      },
    });

    return NextResponse.json(treatments);
  } catch (error) {
    console.error(`POST_TREATMENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
