import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const components = await prisma.treatmentComponents.findMany({});

    return NextResponse.json(components, { status: 200 });
  } catch (error) {
    console.error(`POST_TREATMENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
