import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = async (req: Request) => {
  try {
    const {
      name,
      description,
      price,
      estimatedTime,
      categoryId,
      visits,
      components,
    } = await req.json();

    if (!name || !categoryId || !price) {
      return new NextResponse("Please fill the required fields.", {
        status: 400,
      });
    }

    if (visits.length === 0) {
      return new NextResponse("Please add at least one visit.", {
        status: 400,
      });
    }

    // Check if category exists
    const categoryExists = await prisma.treatmentCategory.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return new NextResponse(
        "Invalid treatment category. Please select right one.",
        {
          status: 400,
        }
      );
    }

    // Check if components exist
    if (components?.length > 0) {
      const componentIds = components.map((c: any) => c.componentId);
      const existingComponents = await prisma.treatmentComponents.findMany({
        where: { id: { in: componentIds } },
      });

      if (existingComponents.length !== componentIds.length) {
        return new NextResponse("One or more components are invalid.", {
          status: 400,
        });
      }
    }

    // Create the treatment
    const treatment = await prisma.treatment.create({
      data: {
        name,
        description,
        price,
        estimateDuration: estimatedTime,
        treatmentCategoryId: categoryId,
        treatmentVisit: {
          create: visits?.map((visit: any) => ({
            name: visit.name,
            description: visit.description,
            price: visit.price?.toString(),
            estimatedDuration: visit.estimatedTime,
          })),
        },
        treatmentComponent: {
          create: components?.map((component: any) => ({
            componentId: component.componentId,
            quantity: component.quantity,
          })),
        },
      },
      include: {
        treatmentVisit: true,
        treatmentComponent: true,
      },
    });

    // Calculate average price from visits if needed
    if (visits?.length > 0) {
      const totalVisitPrice = visits.reduce((sum: number, visit: any) => {
        return sum + parseFloat(visit.price || "0");
      }, 0);

      await prisma.treatment.update({
        where: { id: treatment.id },
        data: { price: totalVisitPrice },
      });
    }

    return NextResponse.json(treatment, { status: 201 });

    // // Create the treatment with its relations in a transaction
    // const treatment = await prisma.$transaction(async (prisma) => {
    //   // Create the main treatment
    //   const newTreatment = await prisma.treatment.create({
    //     data: {
    //       name,
    //       description,
    //       price,
    //       estimateDuration: estimatedTime,
    //       treatmentCategoryId: categoryId,
    //     },
    //   });

    //   // Create visits if provided
    //   if (visits && visits.length > 0) {
    //     await prisma.treatmentVisit.createMany({
    //       data: visits.map((visit: any) => ({
    //         name: visit.name,
    //         description: visit.description,
    //         price: visit.price?.toString() || "0",
    //         estimatedDuration: visit.estimatedTime,
    //         treatment: {
    //           connect: {
    //             id: newTreatment.id,
    //           },
    //         },
    //       })),
    //     });
    //   }

    //   // Create components if provided
    //   if (components && components.length > 0) {
    //     await prisma.treatmentComponent.createMany({
    //       data: components.map((component: any) => ({
    //         componentId: component.componentId,
    //         quantity: component.quantity || 1,
    //         treatment: {
    //           connect: {
    //             id: newTreatment.id,
    //           },
    //         },
    //       })),
    //     });
    //   }

    //   // Return the treatment with its relations
    //   return await prisma.treatment.findUnique({
    //     where: { id: newTreatment.id },
    //     include: {
    //       treatmentVisit: true,
    //       treatmentComponent: {
    //         include: {
    //           component: true,
    //         },
    //       },
    //       treatmentCategory: true,
    //     },
    //   });
    // });

    // return NextResponse.json(
    //   {
    //     treatment,
    //     message: "Treatment added successfully",
    //   },
    //   {
    //     status: 201,
    //   }
    // );
  } catch (error) {
    console.error(`POST_TREATMENTS_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
