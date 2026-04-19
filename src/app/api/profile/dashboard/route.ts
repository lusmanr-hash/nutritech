import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get latest plan
    const latestPlan = await prisma.weeklyPlan.findFirst({
      where: { employeeId: session.id },
      orderBy: { createdAt: "desc" },
    });

    let plan = null;
    let weekStart = null;
    if (latestPlan) {
      try {
        plan = JSON.parse(latestPlan.recommendations);
        weekStart = latestPlan.weekStartDate.toISOString();
      } catch {
        // invalid JSON
      }
    }

    return NextResponse.json({
      firstName: session.firstName,
      profile: session.profile
        ? {
            primaryGoal: session.profile.primaryGoal,
            dietaryPreference: session.profile.dietaryPreference,
            activityLevel: session.profile.activityLevel,
          }
        : null,
      plan,
      weekStart,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
