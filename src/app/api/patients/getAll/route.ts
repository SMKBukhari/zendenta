import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const patients = await prisma.user.findMany({
      where: {
        role: "PATIENT",
      },
      include: {
        patientRecord: {
          include: {
            primaryDentist: true,
            createdBy: true,
            medicalHistory: true,
            dentalRecords: true,
          },
        },
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error(`GET_PATIENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
