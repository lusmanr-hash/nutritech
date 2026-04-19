import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    await prisma.employeeProfile.upsert({
      where: { employeeId: session.id },
      update: {
        age: data.age ? parseInt(data.age) : null,
        gender: data.gender || null,
        heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
        weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
        primaryGoal: data.primaryGoal || null,
        targetWeightKg: data.targetWeightKg ? parseFloat(data.targetWeightKg) : null,
        dietaryPreference: data.dietaryPreference || null,
        allergies: data.allergies?.length ? JSON.stringify(data.allergies) : null,
        intolerances: null,
        dislikedFoods: data.dislikedFoods || null,
        activityLevel: data.activityLevel || null,
        exerciseFrequency: data.exerciseFrequency || null,
        exerciseType: data.exerciseType || null,
        healthConditions: data.healthConditions?.length ? JSON.stringify(data.healthConditions) : null,
        currentlyOnMedication: data.currentlyOnMedication || false,
        medicationNotes: data.medicationNotes || null,
        mealsPerDay: data.mealsPerDay || null,
        snackingHabit: data.snackingHabit || null,
        waterIntakeLiters: data.waterIntakeLiters || null,
        biggestNutritionChallenge: data.biggestNutritionChallenge || null,
      },
      create: {
        employeeId: session.id,
        age: data.age ? parseInt(data.age) : null,
        gender: data.gender || null,
        heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
        weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
        primaryGoal: data.primaryGoal || null,
        targetWeightKg: data.targetWeightKg ? parseFloat(data.targetWeightKg) : null,
        dietaryPreference: data.dietaryPreference || null,
        allergies: data.allergies?.length ? JSON.stringify(data.allergies) : null,
        intolerances: null,
        dislikedFoods: data.dislikedFoods || null,
        activityLevel: data.activityLevel || null,
        exerciseFrequency: data.exerciseFrequency || null,
        exerciseType: data.exerciseType || null,
        healthConditions: data.healthConditions?.length ? JSON.stringify(data.healthConditions) : null,
        currentlyOnMedication: data.currentlyOnMedication || false,
        medicationNotes: data.medicationNotes || null,
        mealsPerDay: data.mealsPerDay || null,
        snackingHabit: data.snackingHabit || null,
        waterIntakeLiters: data.waterIntakeLiters || null,
        biggestNutritionChallenge: data.biggestNutritionChallenge || null,
      },
    });

    // Update first name if provided and mark onboarding complete
    await prisma.employee.update({
      where: { id: session.id },
      data: {
        ...(data.firstName ? { firstName: data.firstName } : {}),
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
