import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { name, phoneNumber, address } = await req.json();

    const { id } = await params;

    const createClinic = await prisma.clinic.create({
      data: {
        name,
        phoneNumber,
        address,
      },
    });

    const updateUser = await prisma.user.update({
      where: { id },
      data: {
        clinic: {
          connect: {
            id: createClinic.id,
          },
        },
        isHired: true,
      },
    });

    return NextResponse.json({ updateUser });
  } catch (error) {
    console.error(`COMPANY_CONFIG: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
