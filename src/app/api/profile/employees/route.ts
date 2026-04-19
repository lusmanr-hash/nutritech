import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employees = await prisma.employee.findMany({
      where: { companyId: session.companyId },
      include: {
        weeklyPlans: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { sentAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      employees: employees.map((e) => ({
        id: e.id,
        email: e.email,
        firstName: e.firstName,
        lastName: e.lastName,
        onboardingCompleted: e.onboardingCompleted,
        createdAt: e.createdAt.toISOString(),
        lastPlanSent: e.weeklyPlans[0]?.sentAt?.toISOString() || null,
      })),
    });
  } catch (error) {
    console.error("Employees list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
