import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new NextResponse("Reservation ID is required", { status: 400 });
    }

    // Check if the reservation exists
    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    });

    if (!existingReservation) {
      return new NextResponse("Reservation not found", { status: 404 });
    }

    // Delete the reservation
    await prisma.reservation.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_RESERVATION_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
