import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { name, price } = await req.json();

    if (!name || !price) {
      return new NextResponse("Please add component name and its price.", {
        status: 400,
      });
    }

    const componentExist = await prisma.treatmentComponents.findFirst({
      where: {
        name,
      },
    });

    if (componentExist) {
      return new NextResponse("Component already exist!", { status: 400 });
    }

    const component = await prisma.treatmentComponents.create({
      data: {
        name,
        price,
      },
    });

    return NextResponse.json({ component }, { status: 201 });
  } catch (error) {
    console.error(`POST_CREATE_COMPONENT_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
