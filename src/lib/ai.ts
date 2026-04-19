import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

interface EmployeeProfileData {
  firstName: string;
  age?: number | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  primaryGoal?: string | null;
  targetWeightKg?: number | null;
  dietaryPreference?: string | null;
  allergies?: string | null;
  intolerances?: string | null;
  dislikedFoods?: string | null;
  activityLevel?: string | null;
  exerciseFrequency?: string | null;
  exerciseType?: string | null;
  healthConditions?: string | null;
  currentlyOnMedication?: boolean;
  medicationNotes?: string | null;
  mealsPerDay?: string | null;
  snackingHabit?: string | null;
  waterIntakeLiters?: string | null;
  biggestNutritionChallenge?: string | null;
}

interface MenuItemData {
  dayOfWeek: string;
  mealType: string;
  name: string;
  description?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  tags?: string | null;
}

export async function generateMealPlan(
  profile: EmployeeProfileData,
  menuItems: MenuItemData[]
) {
  const menuByDay: Record<string, MenuItemData[]> = {};
  for (const item of menuItems) {
    if (!menuByDay[item.dayOfWeek]) menuByDay[item.dayOfWeek] = [];
    menuByDay[item.dayOfWeek].push(item);
  }

  const menuText = Object.entries(menuByDay)
    .map(([day, items]) => {
      const dishesText = items
        .map(
          (item) =>
            `  - ${item.name} (${item.mealType})${item.description ? `: ${item.description}` : ""}${item.calories ? ` | ${item.calories} cal` : ""}${item.protein ? ` | P:${item.protein}g` : ""}${item.carbs ? ` | C:${item.carbs}g` : ""}${item.fat ? ` | F:${item.fat}g` : ""}${item.tags ? ` | Tags: ${item.tags}` : ""}`
        )
        .join("\n");
      return `${day.charAt(0).toUpperCase() + day.slice(1)}:\n${dishesText}`;
    })
    .join("\n\n");

  const profileText = `
Name: ${profile.firstName}
Age: ${profile.age || "Not specified"}
Gender: ${profile.gender || "Not specified"}
Height: ${profile.heightCm ? `${profile.heightCm} cm` : "Not specified"}
Weight: ${profile.weightKg ? `${profile.weightKg} kg` : "Not specified"}
Primary Goal: ${profile.primaryGoal?.replace(/_/g, " ") || "Not specified"}
${profile.targetWeightKg ? `Target Weight: ${profile.targetWeightKg} kg` : ""}
Dietary Preference: ${profile.dietaryPreference || "Not specified"}
Allergies: ${profile.allergies || "None"}
Intolerances: ${profile.intolerances || "None"}
Disliked Foods: ${profile.dislikedFoods || "None"}
Activity Level: ${profile.activityLevel?.replace(/_/g, " ") || "Not specified"}
Exercise Frequency: ${profile.exerciseFrequency?.replace(/_/g, " ") || "Not specified"}
Exercise Type: ${profile.exerciseType || "Not specified"}
Health Conditions: ${profile.healthConditions || "None"}
Medications: ${profile.currentlyOnMedication ? `Yes - ${profile.medicationNotes || ""}` : "No"}
Meals Per Day: ${profile.mealsPerDay || "Not specified"}
Snacking Habit: ${profile.snackingHabit || "Not specified"}
Water Intake: ${profile.waterIntakeLiters?.replace(/_/g, " ") || "Not specified"}
Biggest Challenge: ${profile.biggestNutritionChallenge || "Not specified"}
`.trim();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a professional nutrition assistant working under the guidance of Noam Radlich, a clinical dietitian. Your job is to recommend specific dishes from a restaurant menu that best match each employee's personal profile and goals.

Guidelines from the dietitian:
- Prioritize balanced meals: protein + complex carbs + vegetables
- For weight loss goals: recommend lower calorie options, higher protein
- For muscle building: prioritize high protein dishes, adequate carbs around workouts
- For energy: balanced meals, avoid heavy/fried options at lunch
- Always respect dietary restrictions and allergies (THIS IS CRITICAL — never recommend a dish containing an allergen)
- Recommend appropriate portion sizes based on the person's goal and activity level
- Include a short, friendly explanation for each recommendation
- Add a weekly nutrition tip relevant to the person's goal`,
    messages: [
      {
        role: "user",
        content: `Generate a personalized weekly meal plan for this employee:

EMPLOYEE PROFILE:
${profileText}

THIS WEEK'S MENU:
${menuText}

Respond ONLY in valid JSON format (no markdown, no backticks):
{
  "weeklyTip": "string — one practical nutrition tip for this person",
  "days": [
    {
      "day": "Sunday",
      "meals": [
        {
          "mealType": "lunch",
          "recommendedDish": "dish name exactly as in menu",
          "portionNote": "e.g., Regular portion / Half portion / Extra protein",
          "reason": "Short friendly explanation — why this dish is good for them",
          "calories": number or null,
          "macros": { "protein": number or null, "carbs": number or null, "fat": number or null }
        }
      ]
    }
  ]
}`,
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === "text");
  if (!textContent || textContent.type !== "text") {
    throw new Error("No text response from AI");
  }

  return JSON.parse(textContent.text);
}
