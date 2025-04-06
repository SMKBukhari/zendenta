import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all staff members with role EMPLOYEE
    const dentists = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        isHired: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        specialist: true,
        jobType: true,
        // Count today's appointments
        _count: {
          select: {
            dentistReservations: {
              where: {
                dateTime: {
                  gte: new Date(new Date().setHours(0, 0, 0, 0)),
                  lt: new Date(new Date().setHours(23, 59, 59, 999)),
                },
              },
            },
          },
        },
      },
    });

    // Format the response
    const formattedDentists = dentists.map((dentist) => ({
      id: dentist.id,
      name: dentist.name,
      imageUrl: dentist.imageUrl,
      specialty: dentist.specialist,
      jobType: dentist.jobType,
      appointmentCount: dentist._count.dentistReservations,
    }));

    return NextResponse.json(formattedDentists);
  } catch (error) {
    console.error("GET_DENTISTS_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
