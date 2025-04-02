import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const categories = await prisma.treatmentCategory.findMany({});

    return NextResponse.json(categories);
  } catch (error) {
    console.error(`POST_TREATMENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
