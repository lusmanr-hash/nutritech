import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existing = await prisma.employee.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Get or create default company
    let company = await prisma.company.findFirst();
    if (!company) {
      company = await prisma.company.create({ data: { name: "Demo Company" } });
    }

    const passwordHash = await hashPassword(password);
    const employee = await prisma.employee.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        companyId: company.id,
      },
    });

    const token = generateToken({ id: employee.id, email: employee.email, role: employee.role });
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      onboardingCompleted: employee.onboardingCompleted,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
