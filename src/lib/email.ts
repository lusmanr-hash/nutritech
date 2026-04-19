interface MealRecommendation {
  mealType: string;
  recommendedDish: string;
  portionNote: string;
  reason: string;
  calories: number | null;
  macros: { protein: number | null; carbs: number | null; fat: number | null };
}

interface DayPlan {
  day: string;
  meals: MealRecommendation[];
}

interface WeeklyPlanData {
  weeklyTip: string;
  days: DayPlan[];
}

export function generateWeeklyPlanEmail(firstName: string, plan: WeeklyPlanData): string {
  const daysHtml = plan.days
    .map(
      (day) => `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #1B6B4D; font-size: 18px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 2px solid #E8F5E9;">${day.day}</h3>
        ${day.meals
          .map(
            (meal) => `
          <div style="background: #F7FAF8; border-radius: 12px; padding: 16px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="background: #27AE60; color: white; padding: 2px 10px; border-radius: 20px; font-size: 12px; text-transform: capitalize;">${meal.mealType}</span>
              ${meal.calories ? `<span style="color: #27AE60; font-size: 13px; font-weight: 600;">${meal.calories} cal</span>` : ""}
            </div>
            <h4 style="color: #1A1A2E; font-size: 16px; margin: 8px 0 4px 0;">${meal.recommendedDish}</h4>
            ${meal.portionNote ? `<p style="color: #E8A838; font-size: 13px; margin: 0 0 4px 0;">📏 ${meal.portionNote}</p>` : ""}
            <p style="color: #3A4A42; font-size: 14px; margin: 0; opacity: 0.8;">${meal.reason}</p>
            ${
              meal.macros?.protein || meal.macros?.carbs || meal.macros?.fat
                ? `<p style="color: #3A4A42; font-size: 12px; margin: 8px 0 0 0; opacity: 0.6;">
                    ${meal.macros.protein ? `P: ${meal.macros.protein}g` : ""}
                    ${meal.macros.carbs ? ` · C: ${meal.macros.carbs}g` : ""}
                    ${meal.macros.fat ? ` · F: ${meal.macros.fat}g` : ""}
                  </p>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #F7FAF8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: #1B6B4D; border-radius: 16px; padding: 12px; margin-bottom: 12px;">
        <span style="color: white; font-size: 24px;">🌿</span>
      </div>
      <h1 style="color: #1A1A2E; font-size: 24px; margin: 0;">Your meal plan for this week</h1>
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <p style="color: #3A4A42; font-size: 16px; margin: 0 0 24px 0;">Hey ${firstName},</p>

      <!-- Weekly Tip -->
      ${
        plan.weeklyTip
          ? `
      <div style="background: #FFF8E1; border-radius: 12px; padding: 16px; margin-bottom: 24px; border-left: 4px solid #E8A838;">
        <p style="color: #E8A838; font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">💡 Weekly Nutrition Tip</p>
        <p style="color: #3A4A42; font-size: 14px; margin: 0;">${plan.weeklyTip}</p>
      </div>
      `
          : ""
      }

      <!-- Days -->
      ${daysHtml}
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 24px; padding: 16px;">
      <p style="color: #3A4A42; font-size: 13px; opacity: 0.6; margin: 0 0 8px 0;">
        This plan was created based on your profile and reviewed by our nutrition team.
      </p>
      <p style="color: #3A4A42; font-size: 13px; opacity: 0.6; margin: 0;">
        Want to update your preferences? Log in to NutriTech.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateProgressEmail(firstName: string, weeksOnProgram: number, goal: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background: #F7FAF8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px 16px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: #1B6B4D; border-radius: 16px; padding: 12px; margin-bottom: 12px;">
        <span style="color: white; font-size: 24px;">📊</span>
      </div>
      <h1 style="color: #1A1A2E; font-size: 24px; margin: 0;">Your nutrition journey — 2-week update</h1>
    </div>

    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
      <p style="color: #3A4A42; font-size: 16px; margin: 0 0 24px 0;">Hey ${firstName},</p>

      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background: #E8F5E9; border-radius: 12px; padding: 20px 32px;">
          <p style="color: #27AE60; font-size: 36px; font-weight: 700; margin: 0;">${weeksOnProgram}</p>
          <p style="color: #3A4A42; font-size: 13px; margin: 4px 0 0 0; opacity: 0.7;">weeks on the program</p>
        </div>
      </div>

      <div style="background: #F7FAF8; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <p style="color: #3A4A42; font-size: 13px; margin: 0 0 4px 0; opacity: 0.7;">Your goal</p>
        <p style="color: #1A1A2E; font-size: 16px; font-weight: 600; margin: 0;">${goal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
      </div>

      <p style="color: #3A4A42; font-size: 14px; margin: 16px 0;">
        Keep up the great work! Consistency is what makes the difference. Every healthy meal choice adds up.
      </p>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #3A4A42; font-size: 13px; opacity: 0.6;">
        Update your profile or book a 1:1 session by logging in to NutriTech.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
