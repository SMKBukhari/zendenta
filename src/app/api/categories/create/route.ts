import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Please add category name.", {
        status: 400,
      });
    }

    const categoryExist = await prisma.treatmentCategory.findFirst({
      where: {
        name,
      },
    });

    if (categoryExist) {
      return new NextResponse("Category already exist!", { status: 400 });
    }

    const category = await prisma.treatmentCategory.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error(`POST_CREATE_CATEGORY_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
