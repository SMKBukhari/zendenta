import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // Treatment Category
    const cleaningCategory = await prisma.treatmentCategory.create({
      data: {
        name: "Preventive Care",
      },
    });

    // Treatment Components
    const fluoride = await prisma.treatmentComponents.create({
      data: {
        name: "Fluoride Treatment",
        price: 15.0,
      },
    });

    const cleaning = await prisma.treatmentComponents.create({
      data: {
        name: "Professional Cleaning Tools",
        price: 25.0,
      },
    });

    // Treatment
    const teethCleaning = await prisma.treatment.create({
      data: {
        name: "Basic Teeth Cleaning",
        description: "Professional teeth cleaning with fluoride treatment",
        price: 100.0,
        estimateDuration: "30 minutes",
        treatmentCategoryId: cleaningCategory.id,
        treatmentComponent: {
          create: [
            { componentId: fluoride.id, quantity: 1 },
            { componentId: cleaning.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: {
            name: "Initial Cleaning",
            description: "Complete plaque and tartar removal",
            price: "100.00",
            estimatedDuration: "30 minutes",
          },
        },
      },
    });

    // Treatment Components
    const composite = await prisma.treatmentComponents.create({
      data: {
        name: "Composite Resin",
        price: 45.0,
      },
    });

    const anesthetic = await prisma.treatmentComponents.create({
      data: {
        name: "Local Anesthetic",
        price: 20.0,
      },
    });

    // Treatment
    const filling = await prisma.treatment.create({
      data: {
        name: "Tooth Filling",
        description: "Composite resin filling for cavities",
        price: 200.0,
        estimateDuration: "45 minutes",
        treatmentCategoryId: cleaningCategory.id,
        treatmentComponent: {
          create: [
            { componentId: composite.id, quantity: 1 },
            { componentId: anesthetic.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: {
            name: "Filling Procedure",
            description: "Cavity preparation and filling placement",
            price: "200.00",
            estimatedDuration: "45 minutes",
          },
        },
      },
    });

    // Treatment Category
    const restorativeCategory = await prisma.treatmentCategory.create({
      data: {
        name: "Restorative Dentistry",
      },
    });

    // Treatment Components
    const guttaPercha = await prisma.treatmentComponents.create({
      data: {
        name: "Gutta Percha Points",
        price: 30.0,
      },
    });

    const sealer = await prisma.treatmentComponents.create({
      data: {
        name: "Root Canal Sealer",
        price: 25.0,
      },
    });

    // Treatment
    const rootCanal = await prisma.treatment.create({
      data: {
        name: "Root Canal Therapy",
        description: "Endodontic treatment for infected tooth pulp",
        price: 800.0,
        estimateDuration: "90 minutes",
        treatmentCategoryId: restorativeCategory.id,
        treatmentComponent: {
          create: [
            { componentId: guttaPercha.id, quantity: 1 },
            { componentId: sealer.id, quantity: 1 },
            { componentId: anesthetic.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: [
            {
              name: "Initial Consultation",
              description: "Diagnosis and treatment planning",
              price: "100.00",
              estimatedDuration: "30 minutes",
            },
            {
              name: "Main Procedure",
              description: "Pulp removal and canal filling",
              price: "700.00",
              estimatedDuration: "90 minutes",
            },
          ],
        },
      },
    });

    // Treatment Components
    const ceramic = await prisma.treatmentComponents.create({
      data: {
        name: "Ceramic Crown",
        price: 500.0,
      },
    });

    const tempCrown = await prisma.treatmentComponents.create({
      data: {
        name: "Temporary Crown",
        price: 50.0,
      },
    });

    // Treatment
    const crown = await prisma.treatment.create({
      data: {
        name: "Porcelain Crown",
        description: "Custom ceramic crown for damaged teeth",
        price: 1200.0,
        estimateDuration: "2 visits",
        treatmentCategoryId: restorativeCategory.id,
        treatmentComponent: {
          create: [
            { componentId: ceramic.id, quantity: 1 },
            { componentId: tempCrown.id, quantity: 1 },
            { componentId: anesthetic.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: [
            {
              name: "Tooth Preparation",
              description: "Tooth shaping and impression",
              price: "400.00",
              estimatedDuration: "60 minutes",
            },
            {
              name: "Crown Placement",
              description: "Permanent crown cementation",
              price: "800.00",
              estimatedDuration: "45 minutes",
            },
          ],
        },
      },
    });

    // Treatment Category
    const cosmeticCategory = await prisma.treatmentCategory.create({
      data: {
        name: "Cosmetic Dentistry",
      },
    });

    // Treatment Components
    const whiteningGel = await prisma.treatmentComponents.create({
      data: {
        name: "Whitening Gel",
        price: 60.0,
      },
    });

    const tray = await prisma.treatmentComponents.create({
      data: {
        name: "Custom Tray",
        price: 40.0,
      },
    });

    // Treatment
    const whitening = await prisma.treatment.create({
      data: {
        name: "Professional Teeth Whitening",
        description: "In-office teeth whitening treatment",
        price: 350.0,
        estimateDuration: "60 minutes",
        treatmentCategoryId: cosmeticCategory.id,
        treatmentComponent: {
          create: [
            { componentId: whiteningGel.id, quantity: 1 },
            { componentId: tray.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: {
            name: "Whitening Session",
            description: "Complete whitening procedure",
            price: "350.00",
            estimatedDuration: "60 minutes",
          },
        },
      },
    });

    const drSarah = await prisma.user.create({
      data: {
        email: "sarah.johnson@dentalclinic.com",
        password: "hashed_password_123", // In real app, use proper hashing
        name: "Dr. Sarah Johnson",
        phoneNumber: "+15551234567",
        gender: "FEMALE",
        birthDate: new Date("1985-06-15"),
        address: "123 Dental Street",
        city: "New York",
        zipCode: "10001",
        jobType: "FULL_TIME",
        specialist: "General Dentistry",
        designation: "Senior Dentist",
        role: "EMPLOYEE",
        isVerified: true,
        isHired: true,
        workingHours: {
          create: [
            { weekDay: "MONDAY", from: "09:00", to: "17:00" },
            { weekDay: "WEDNESDAY", from: "09:00", to: "17:00" },
            { weekDay: "FRIDAY", from: "09:00", to: "17:00" },
          ],
        },
        assignedTreatments: {
          create: [
            { treatmentId: teethCleaning.id },
            { treatmentId: filling.id },
            { treatmentId: whitening.id },
          ],
        },
      },
    });

    const drMichael = await prisma.user.create({
      data: {
        email: "michael.chen@dentalclinic.com",
        password: "hashed_password_456", // In real app, use proper hashing
        name: "Dr. Michael Chen",
        phoneNumber: "+15559876543",
        gender: "MALE",
        birthDate: new Date("1979-11-22"),
        address: "456 Root Canal Ave",
        city: "New York",
        zipCode: "10001",
        jobType: "FULL_TIME",
        specialist: "Endodontics",
        designation: "Endodontist",
        role: "EMPLOYEE",
        isVerified: true,
        isHired: true,
        workingHours: {
          create: [
            { weekDay: "TUESDAY", from: "10:00", to: "18:00" },
            { weekDay: "THURSDAY", from: "10:00", to: "18:00" },
          ],
        },
        assignedTreatments: {
          create: [{ treatmentId: rootCanal.id }],
        },
      },
    });

    // Treatment Components
    const implantPost = await prisma.treatmentComponents.create({
      data: {
        name: "Titanium Implant Post",
        price: 800.0,
      },
    });

    const abutment = await prisma.treatmentComponents.create({
      data: {
        name: "Abutment",
        price: 300.0,
      },
    });

    // Treatment
    const implant = await prisma.treatment.create({
      data: {
        name: "Dental Implant",
        description: "Titanium implant with ceramic crown",
        price: 3000.0,
        estimateDuration: "Multiple visits over 3-6 months",
        treatmentCategoryId: restorativeCategory.id,
        treatmentComponent: {
          create: [
            { componentId: implantPost.id, quantity: 1 },
            { componentId: abutment.id, quantity: 1 },
            { componentId: ceramic.id, quantity: 1 },
            { componentId: anesthetic.id, quantity: 1 },
          ],
        },
        treatmentVisit: {
          create: [
            {
              name: "Consultation and Planning",
              price: "200.00",
              estimatedDuration: "60 minutes",
            },
            {
              name: "Implant Placement",
              price: "1500.00",
              estimatedDuration: "90 minutes",
            },
            {
              name: "Abutment Placement",
              price: "500.00",
              estimatedDuration: "60 minutes",
            },
            {
              name: "Crown Placement",
              price: "800.00",
              estimatedDuration: "60 minutes",
            },
          ],
        },
      },
    });

    // Treatment Category
    const orthoCategory = await prisma.treatmentCategory.create({
      data: {
        name: "Orthodontics",
      },
    });

    // Treatment
    const orthoConsult = await prisma.treatment.create({
      data: {
        name: "Orthodontic Consultation",
        description: "Initial evaluation for braces or aligners",
        price: 150.0,
        estimateDuration: "60 minutes",
        treatmentCategoryId: orthoCategory.id,
      },
    });

    // Treatment
    const extraction = await prisma.treatment.create({
      data: {
        name: "Tooth Extraction",
        description: "Simple tooth removal",
        price: 250.0,
        estimateDuration: "45 minutes",
        treatmentCategoryId: restorativeCategory.id,
        treatmentComponent: {
          create: [{ componentId: anesthetic.id, quantity: 1 }],
        },
      },
    });

    // Treatment Components
    const veneer = await prisma.treatmentComponents.create({
      data: {
        name: "Porcelain Veneer",
        price: 800.0,
      },
    });

    // Treatment
    const veneers = await prisma.treatment.create({
      data: {
        name: "Porcelain Veneers",
        description: "Custom ceramic veneers for cosmetic improvement",
        price: 1000.0,
        estimateDuration: "2 visits",
        treatmentCategoryId: cosmeticCategory.id,
        treatmentComponent: {
          create: [{ componentId: veneer.id, quantity: 1 }],
        },
      },
    });

    return NextResponse.json(
      {
        message: "Test data created successfully",
        data: {
          cleaningCategory,
          restorativeCategory,
          cosmeticCategory,
          orthoCategory,
          teethCleaning,
          filling,
          rootCanal,
          crown,
          whitening,
          implant,
          orthoConsult,
          extraction,
          veneers,
          fluoride,
          cleaning,
          composite,
          anesthetic,
          guttaPercha,
          sealer,
          ceramic,
          tempCrown,
          whiteningGel,
          tray,
          implantPost,
          abutment,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(`POST_TEST_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
