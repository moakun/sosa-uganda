import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import * as z from "zod";

const userSchema = z.object({
  fullName: z.string().min(1, "Full Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  companyName: z.string().min(1, "Company Name is required"),
  password: z
    .string()
    .min(1, "Password is required")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, fullName, password, companyName } = userSchema.parse(body);

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email Deja Utiliser" },
        { status: 409 }
      );
    }

    // Check if company name already exists
    const existingUserByCompanyName = await db.user.findUnique({
      where: { companyName },
    });

    if (existingUserByCompanyName) {
      return NextResponse.json(
        { error: "Nom de societe deja utiliser" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        fullName,
        email,
        companyName,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
