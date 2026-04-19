import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weekStart = getWeekStart();

    let menu = await prisma.weeklyMenu.findFirst({
      where: {
        companyId: session.companyId,
        weekStartDate: weekStart,
      },
      include: { menuItems: true },
    });

    // Also try to find any menu for this company
    if (!menu) {
      menu = await prisma.weeklyMenu.findFirst({
        where: { companyId: session.companyId },
        orderBy: { weekStartDate: "desc" },
        include: { menuItems: true },
      });
    }

    return NextResponse.json({ menu });
  } catch (error) {
    console.error("Menu fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const weekStart = getWeekStart();

    // Get or create weekly menu
    let menu = await prisma.weeklyMenu.findFirst({
      where: {
        companyId: session.companyId,
        weekStartDate: weekStart,
      },
    });

    if (!menu) {
      menu = await prisma.weeklyMenu.create({
        data: {
          companyId: session.companyId,
          weekStartDate: weekStart,
        },
      });
    }

    const item = await prisma.menuItem.create({
      data: {
        weeklyMenuId: menu.id,
        dayOfWeek: data.dayOfWeek,
        mealType: data.mealType,
        name: data.name,
        description: data.description || null,
        calories: data.calories || null,
        protein: data.protein || null,
        carbs: data.carbs || null,
        fat: data.fat || null,
        tags: data.tags || null,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Menu add error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Menu delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
