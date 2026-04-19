"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Leaf, User, Target, Dumbbell, Utensils, Calendar,
  LogOut, ChevronRight, Lightbulb, Clock,
} from "lucide-react";

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

interface WeeklyPlan {
  weeklyTip: string;
  days: DayPlan[];
}

interface ProfileSummary {
  primaryGoal: string | null;
  dietaryPreference: string | null;
  activityLevel: string | null;
}

interface DashboardData {
  firstName: string;
  profile: ProfileSummary | null;
  plan: WeeklyPlan | null;
  weekStart: string | null;
}

const goalIcons: Record<string, string> = {
  lose_weight: "🎯",
  gain_muscle: "💪",
  maintain: "⚖️",
  energy: "⚡",
  general_health: "🌿",
};

function formatLabel(val: string | null | undefined) {
  if (!val) return "—";
  return val.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/dashboard")
      .then((r) => {
        if (r.status === 401) { router.push("/"); return null; }
        return r.json();
      })
      .then((d) => { if (d) setData(d); })
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#27AE60] border-t-transparent" />
      </div>
    );
  }

  if (!data) return null;

  const plan = data.plan;
  const profile = data.profile;

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B6B4D]">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-[#1A1A2E]">NutriTech</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-1.5 h-4 w-4" /> Log out
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        {/* Welcome */}
        <h1 className="text-2xl font-bold text-[#1A1A2E]">
          Hey {data.firstName}, here&apos;s your plan for this week
        </h1>
        {data.weekStart && (
          <p className="mt-1 text-sm text-[#3A4A42]/60">
            Week of {new Date(data.weekStart).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main content — meal plan */}
          <div className="space-y-6 lg:col-span-2">
            {/* Weekly tip */}
            {plan?.weeklyTip && (
              <Card className="border-[#E8A838]/20 bg-[#E8A838]/5">
                <CardContent className="flex gap-3 p-5">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-[#E8A838]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A2E]">Weekly Nutrition Tip</p>
                    <p className="mt-1 text-sm text-[#3A4A42]/80">{plan.weeklyTip}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Day-by-day plan */}
            {plan?.days && plan.days.length > 0 ? (
              plan.days.map((day) => (
                <Card key={day.day}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Calendar className="h-5 w-5 text-[#27AE60]" />
                      {day.day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {day.meals.map((meal, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-100 bg-gray-50/50 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {meal.mealType}
                              </Badge>
                              {meal.portionNote && (
                                <Badge variant="outline" className="text-xs">
                                  {meal.portionNote}
                                </Badge>
                              )}
                            </div>
                            <h4 className="mt-2 font-semibold text-[#1A1A2E]">
                              {meal.recommendedDish}
                            </h4>
                            <p className="mt-1 text-sm text-[#3A4A42]/70">{meal.reason}</p>
                          </div>
                          {meal.calories && (
                            <span className="ml-4 shrink-0 text-sm font-medium text-[#27AE60]">
                              {meal.calories} cal
                            </span>
                          )}
                        </div>
                        {(meal.macros?.protein || meal.macros?.carbs || meal.macros?.fat) && (
                          <div className="mt-3 flex gap-4 text-xs text-[#3A4A42]/60">
                            {meal.macros.protein != null && (
                              <span>Protein: {meal.macros.protein}g</span>
                            )}
                            {meal.macros.carbs != null && (
                              <span>Carbs: {meal.macros.carbs}g</span>
                            )}
                            {meal.macros.fat != null && (
                              <span>Fat: {meal.macros.fat}g</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <Utensils className="h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-semibold text-[#1A1A2E]">
                    No meal plan yet
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-[#3A4A42]/60">
                    Your personalized meal plan will appear here once it&apos;s generated. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-[#27AE60]" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.primaryGoal && (
                  <div className="flex items-center gap-2 text-sm">
                    <span>{goalIcons[profile.primaryGoal] || "🎯"}</span>
                    <span className="text-[#3A4A42]/70">Goal:</span>
                    <span className="font-medium">{formatLabel(profile.primaryGoal)}</span>
                  </div>
                )}
                {profile?.dietaryPreference && (
                  <div className="flex items-center gap-2 text-sm">
                    <Utensils className="h-4 w-4 text-[#3A4A42]/40" />
                    <span className="text-[#3A4A42]/70">Diet:</span>
                    <span className="font-medium capitalize">{profile.dietaryPreference}</span>
                  </div>
                )}
                {profile?.activityLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <Dumbbell className="h-4 w-4 text-[#3A4A42]/40" />
                    <span className="text-[#3A4A42]/70">Activity:</span>
                    <span className="font-medium">{formatLabel(profile.activityLevel)}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => router.push("/onboarding")}
                >
                  Edit Profile
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Nutrition tip card (static for MVP) */}
            <Card className="border-[#1B6B4D]/10 bg-[#1B6B4D]/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#1B6B4D]">
                  <Target className="mr-1.5 inline h-4 w-4" />
                  Quick Tip from Noam
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#1B6B4D]/80">
                  Try to eat your biggest meal when you&apos;re most active during the day.
                  This helps your body use the energy more efficiently.
                </p>
              </CardContent>
            </Card>

            {/* Next consultation */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-[#E8A838]" />
                  Next 1:1 Session
                </CardTitle>
                <CardDescription>Your next nutrition consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-[#1A1A2E]">Coming soon</p>
                <p className="mt-1 text-xs text-[#3A4A42]/60">
                  We&apos;ll notify you when scheduling is available
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
