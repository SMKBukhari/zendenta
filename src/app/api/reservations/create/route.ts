import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      treatmentId,
      dentistId,
      patientName,
      date,
      startTime,
      endTime,
      quickNote,
      patientDetails,
      oralHygieneHabits,
    } = body;

    const requiredFields = [
      "treatmentId",
      "dentistId",
      "patientName",
      "date",
      "startTime",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return new NextResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        { status: 400 }
      );
    }

    // Check if patient exists
    let patient = await prisma.user.findFirst({
      where: {
        name: patientName,
        email: patientDetails.email,
      },
    });

    // Create patient if not exists
    if (!patient) {
      patient = await prisma.user.create({
        data: {
          name: patientName,
          email: patientDetails.email,
          phoneNumber: patientDetails.phoneNumber,
          gender: patientDetails.gender === "Male" ? "MALE" : "FEMALE",
          address: patientDetails.address,
          role: "PATIENT",
          password:
            "$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFAe1CdKWV5RLcO.IfKT6MxOHK", // Default password
          isVerified: true,
        },
      });
    }

    // Parse date and time
    const dateTime = new Date(`${date}T${startTime}:00`);

    // Calculate total price from treatment
    const treatment = await prisma.treatment.findUnique({
      where: {
        id: treatmentId,
      },
    });

    if (!treatment) {
      return new NextResponse("Treatment not found", { status: 404 });
    }

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        treatmentId,
        dentistId,
        userId: patient.id,
        dateTime,
        quickNote,
        totalPrice: treatment.price,
        status: "REGISTERED",
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("CREATE_RESERVATION_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
