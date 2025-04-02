import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { compileOTPMail, sendMail } from "@/lib/emails/mail";

export const POST = async (req: Request) => {
  try {
    const { role, email, password, name, phoneNumber, gender, birthDate } =
      await req.json();

    if (!role || !email || !password || !name || !phoneNumber || !gender) {
      return new NextResponse("Please fill the required fields.", {
        status: 400,
      });
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExist) {
      return new NextResponse(
        "User/Email already exist! Please use your email and password to login",
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otpCode = crypto.randomInt(100000, 999999).toString();
    const otpCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        role: role,
        email: email,
        password: hashedPassword,
        name: name,
        phoneNumber: phoneNumber,
        gender: gender,
        birthDate: birthDate,
        otpCode: otpCode,
        otpCodeExpiry: otpCodeExpiry,
      },
    });

    const emailBody = await compileOTPMail(name, otpCode);

    await sendMail({
      to: email,
      subject: "Email Verification (Zendenta Dental Clinic)",
      body: emailBody,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error(`SINGUP_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
