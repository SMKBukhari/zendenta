import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      reservationId,
      bloodPressure,
      sicknesses,
      allergies,
      dentalRecords,
    } = body;

    // Create medical checkup
    const medicalCheckup = await prisma.medicalCheckup.create({
      data: {
        bloodPressure,
        isDone: true,
        reservation: {
          connect: {
            id: reservationId,
          },
        },
        sicknesses: {
          create: sicknesses.map((name: string) => ({
            name,
            description: "",
          })),
        },
        alergics: {
          create: allergies.map((name: string) => ({
            name,
            description: "",
          })),
        },
        dentalRecords: {
          create: dentalRecords.map((record: any) => ({
            toothNumber: record.toothNumber,
            toothName: record.toothName,
            teethCondition: {
              connect: {
                id: record.teethConditionId,
              },
            },
            treatment: {
              connect: {
                id: record.treatmentId,
              },
            },
            note: record.note,
            isRecommended: record.isRecommended,
            isApproved: record.isApproved,
            isDone: record.isDone,
          })),
        },
      },
      include: {
        dentalRecords: true,
        sicknesses: true,
        alergics: true,
      },
    });

    // Update reservation status
    await prisma.reservation.update({
      where: {
        id: reservationId,
      },
      data: {
        status: "DOING_TREATMENT",
        medicalCheckup: {
          connect: {
            id: medicalCheckup.id,
          },
        },
      },
    });

    return NextResponse.json(medicalCheckup);
  } catch (error) {
    console.error("CREATE_MEDICAL_CHECKUP_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
