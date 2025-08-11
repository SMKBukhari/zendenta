import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    const patients = await prisma.user.findMany({
      where: {
        role: 'PATIENT',
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        gender: true,
        birthDate: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(patients, { status: 200 });
  } catch (error) {
    console.error('Error searching patients:', error);
    return NextResponse.json(
      { message: 'Error searching patients' },
      { status: 500 }
    );
  }
}

// Explicitly define other HTTP methods you want to support
export async function POST() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}