import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return new NextResponse("Date parameter is required", { status: 400 });
    }

    // Parse the date
    const date = new Date(dateParam);

    // Set the start and end of the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all reservations for the date
    const reservations = await prisma.reservation.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        treatment: true,
        dentist: true,
        user: true,
      },
    });

    // Format the reservations
    const formattedReservations = reservations.map((reservation) => {
      const dateTime = new Date(reservation.dateTime);

      return {
        id: reservation.id,
        patientName: reservation.user.name,
        patientId: reservation.userId,
        dentistId: reservation.dentistId,
        dentistName: reservation.dentist.name,
        treatmentId: reservation.treatmentId,
        treatmentName: reservation.treatment.name,
        date: format(dateTime, "yyyy-MM-dd"),
        time: format(dateTime, "HH:mm"),
        status: reservation.status,
        quickNote: reservation.quickNote || "",
      };
    });

    return NextResponse.json(formattedReservations);
  } catch (error) {
    console.error("GET_RESERVATIONS_BY_DATE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
