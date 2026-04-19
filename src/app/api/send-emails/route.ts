import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateWeeklyPlanEmail } from "@/lib/email";

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find unsent plans
    const plans = await prisma.weeklyPlan.findMany({
      where: {
        sentAt: null,
        employee: { companyId: session.companyId },
      },
      include: {
        employee: true,
      },
    });

    if (plans.length === 0) {
      return NextResponse.json({ error: "No unsent plans found. Generate plans first." }, { status: 400 });
    }

    let sent = 0;
    let failed = 0;

    for (const plan of plans) {
      try {
        const recommendations = JSON.parse(plan.recommendations);
        const _html = generateWeeklyPlanEmail(plan.employee.firstName, recommendations);

        // In production, you'd send via Resend:
        // await resend.emails.send({
        //   from: 'NutriTech <plans@nutritech.com>',
        //   to: plan.employee.email,
        //   subject: 'Your meal plan for this week 🍽️',
        //   html,
        // });

        // For MVP, just mark as sent
        await prisma.weeklyPlan.update({
          where: { id: plan.id },
          data: { sentAt: new Date() },
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send email to ${plan.employee.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({ sent, failed, total: plans.length });
  } catch (error) {
    console.error("Send emails error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
