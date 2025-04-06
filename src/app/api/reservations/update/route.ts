import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    const { id, dentistId, time } = body

    if (!id) {
      return new NextResponse("Reservation ID is required", { status: 400 })
    }

    // Get the existing reservation
    const existingReservation = await prisma.reservation.findUnique({
      where: {
        id,
      },
    })

    if (!existingReservation) {
      return new NextResponse("Reservation not found", { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}

    if (dentistId) {
      updateData.dentistId = dentistId
    }

    if (time) {
      // Get the date part from the existing dateTime
      const existingDate = new Date(existingReservation.dateTime)
      const datePart = existingDate.toISOString().split("T")[0]

      // Combine with the new time
      const newDateTime = new Date(`${datePart}T${time}:00`)
      updateData.dateTime = newDateTime
    }

    // Update the reservation
    const updatedReservation = await prisma.reservation.update({
      where: {
        id,
      },
      data: updateData,
    })

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("UPDATE_RESERVATION_ERROR:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

