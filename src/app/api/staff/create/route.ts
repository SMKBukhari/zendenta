import prisma from "@/lib/prisma";
import { AddStaffFormSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = AddStaffFormSchema.parse(body);

    const { staffBasicInfo, assignedServices, staffWorkingHours } =
      validatedData;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: staffBasicInfo.email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", {
        status: 400,
      });
    }

    // Create the staff member in a transaction
    const staff = await prisma.$transaction(async (tx) => {
      // Create the user
      const newStaff = await tx.user.create({
        data: {
          name: staffBasicInfo.name,
          email: staffBasicInfo.email,
          phoneNumber: staffBasicInfo.phoneNumber,
          address: staffBasicInfo.address,
          imageUrl: staffBasicInfo.imageUrl,
          role: "EMPLOYEE",
          isHired: true,
          jobType: staffBasicInfo.jobType,
          specialist: staffBasicInfo.specialty,
          // Set a temporary password that should be changed on first login
          password:
            "$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFAe1CdKWV5RLcO.IfKT6MxOHK", // hash of 'password123'
          isVerified: true, // Staff members are verified by default
        },
      });

      // Create working hours
      if (staffWorkingHours && staffWorkingHours.length > 0) {
        await Promise.all(
          staffWorkingHours
            .filter((wh) => wh.isWorking)
            .map((wh) =>
              tx.workingHours.create({
                data: {
                  weekDay: wh.day.toUpperCase() as any, // Convert to enum format
                  from: wh.startTime || "09:00 am",
                  to: wh.endTime || "05:00 pm",
                  userId: newStaff.id,
                },
              })
            )
        );
      }

      // Assign services
      if (assignedServices && assignedServices.length > 0) {
        const selectedServices = assignedServices.filter(
          (service) => service.isAssigned
        );

        if (selectedServices.length > 0) {
          await Promise.all(
            selectedServices.map((service) =>
              tx.userTreatment.create({
                data: {
                  userId: newStaff.id,
                  treatmentId: service.id,
                },
              })
            )
          );
        }
      }

      return newStaff;
    });

    return NextResponse.json(
      { staff, message: "Staff member added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST_CREATE_STAFF_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
