import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateMealPlan } from "@/lib/ai";

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find latest menu for this company
    const menu = await prisma.weeklyMenu.findFirst({
      where: { companyId: session.companyId },
      orderBy: { weekStartDate: "desc" },
      include: { menuItems: true },
    });

    if (!menu || menu.menuItems.length === 0) {
      return NextResponse.json({ error: "No menu found. Please add menu items first." }, { status: 400 });
    }

    // Find all onboarded employees
    const employees = await prisma.employee.findMany({
      where: {
        companyId: session.companyId,
        onboardingCompleted: true,
      },
      include: { profile: true },
    });

    if (employees.length === 0) {
      return NextResponse.json({ error: "No onboarded employees found." }, { status: 400 });
    }

    const results: { employeeName: string; status: string; error?: string }[] = [];

    for (const employee of employees) {
      try {
        if (!employee.profile) {
          results.push({
            employeeName: `${employee.firstName} ${employee.lastName}`,
            status: "skipped",
            error: "No profile data",
          });
          continue;
        }

        const plan = await generateMealPlan(
          {
            firstName: employee.firstName,
            ...employee.profile,
          },
          menu.menuItems
        );

        await prisma.weeklyPlan.create({
          data: {
            employeeId: employee.id,
            weeklyMenuId: menu.id,
            weekStartDate: menu.weekStartDate,
            recommendations: JSON.stringify(plan),
          },
        });

        results.push({
          employeeName: `${employee.firstName} ${employee.lastName}`,
          status: "success",
        });
      } catch (err) {
        results.push({
          employeeName: `${employee.firstName} ${employee.lastName}`,
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      total: results.length,
      success: results.filter((r) => r.status === "success").length,
      failed: results.filter((r) => r.status === "failed").length,
      results,
    });
  } catch (error) {
    console.error("Generate plan error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
