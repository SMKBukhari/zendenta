import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreatePatientSchema } from "@/schemas";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = CreatePatientSchema.parse(body);

    const { basicInfo, medicalHistory, createdById, primaryDentistId } =
      validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: basicInfo.email },
    });

    if (existingUser) {
      return new NextResponse("User with this email already exists", {
        status: 400,
      });
    }

    // Create patient in transaction
    const patient = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name: basicInfo.name,
          email: basicInfo.email,
          phoneNumber: basicInfo.phoneNumber,
          address: basicInfo.address,
          gender: basicInfo.gender || "MALE",
          birthDate: basicInfo.birthDate,
          city: basicInfo.city,
          zipCode: basicInfo.zipCode,
          imageUrl: basicInfo.imageUrl,
          role: "PATIENT",
          isVerified: true,
          password:
            "$2a$10$CwTycUXWue0Thq9StjUM0uQxTmrjFAe1CdKWV5RLcO.IfKT6MxOHK", // Default password
        },
      });

      // Create patient record
      await tx.patientRecord.create({
        data: {
          userId: newUser.id,
          status: "ACTIVE",
          primaryDentistId: primaryDentistId || createdById, // Default to creator if no primary dentist specified
          createdById,
          medicalHistory: {
            create: medicalHistory?.map((item) => ({
              condition: item.condition,
              diagnosisDate: item.diagnosisDate,
              treatment: item.treatment,
              notes: item.notes,
            })),
          },
        },
      });

      return newUser;
    });

    return NextResponse.json(
      { patient, message: "Patient created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST_CREATE_PATIENT_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
