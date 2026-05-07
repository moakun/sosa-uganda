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
    .min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const { email, fullName, password, companyName } = userSchema.parse(body);

    const [existingEmail, existingCompany] = await Promise.all([
      db.user.findUnique({ where: { email } }),
      db.user.findUnique({ where: { companyName } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    if (existingCompany) {
      return NextResponse.json(
        { error: "Company name already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Prisma handles autoincrement — no need to manually compute the next ID
    const newUser = await db.user.create({
      data: {
        fullName,
        email,
        companyName,
        password: hashedPassword,
        video1: false,
        video2: false,
        gotAttestation: false,
        date: new Date(),
      },
    });

    const { password: _omitted, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { user: userWithoutPassword, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error("Registration error:", error.message);
    }

    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
