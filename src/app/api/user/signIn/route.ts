import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";
import prisma from "@/lib/prisma";

export const PATCH = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return new NextResponse("User not found with this email", {
        status: 404,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse("Invalid Password", { status: 400 });
    }

    // Generate a session token and set expiry time (e.g., 1 hour)
    const sessionToken = uuidv4();
    const sessionExpiry = addDays(new Date(), 1); // Expires in 1 day

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        loginSessionToken: sessionToken,
        loginSessionExpiry: sessionExpiry,
      },
    });

    // Return userId and isVerified status in the response
    return NextResponse.json({
      user: updatedUser,
      // userId: updatedUser.id,
      // isVerified: updatedUser.isVerified,
      // loginSessionToken: updatedUser.loginSessionToken, // Send session token to the client
      // loginSessionExpiry: updatedUser.loginSessionExpiry, // Send session expiry to the client
      // role: updatedUser.role,
      message: "User SignedIn successfully",
    });
  } catch (error) {
    console.error(`SIGNIN_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
