"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check, Leaf, Sparkles } from "lucide-react";

const TOTAL_STEPS = 10;

interface ProfileData {
  firstName: string;
  age: string;
  gender: string;
  heightCm: string;
  weightKg: string;
  primaryGoal: string;
  targetWeightKg: string;
  dietaryPreference: string;
  allergies: string[];
  dislikedFoods: string;
  activityLevel: string;
  exerciseFrequency: string;
  exerciseType: string;
  healthConditions: string[];
  currentlyOnMedication: boolean;
  medicationNotes: string;
  mealsPerDay: string;
  snackingHabit: string;
  waterIntakeLiters: string;
  biggestNutritionChallenge: string;
}

const initialData: ProfileData = {
  firstName: "",
  age: "",
  gender: "",
  heightCm: "",
  weightKg: "",
  primaryGoal: "",
  targetWeightKg: "",
  dietaryPreference: "",
  allergies: [],
  dislikedFoods: "",
  activityLevel: "",
  exerciseFrequency: "",
  exerciseType: "",
  healthConditions: [],
  currentlyOnMedication: false,
  medicationNotes: "",
  mealsPerDay: "",
  snackingHabit: "",
  waterIntakeLiters: "",
  biggestNutritionChallenge: "",
};

function SelectionCard({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
        selected
          ? "border-[#27AE60] bg-[#27AE60]/5 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      <span className={`font-medium ${selected ? "text-[#1B6B4D]" : "text-[#3A4A42]"}`}>
        {label}
      </span>
      {selected && <Check className="ml-auto h-5 w-5 text-[#27AE60]" />}
    </button>
  );
}

function ChipSelector({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              isSelected
                ? "bg-[#27AE60] text-white shadow-sm"
                : "bg-gray-100 text-[#3A4A42] hover:bg-gray-200"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);

  const update = useCallback(
    (fields: Partial<ProfileData>) => setData((prev) => ({ ...prev, ...fields })),
    []
  );

  const toggleArrayField = useCallback(
    (field: "allergies" | "healthConditions", value: string) => {
      setData((prev) => {
        const arr = prev[field];
        if (value === "None") return { ...prev, [field]: [] };
        const newArr = arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr.filter((v) => v !== "None"), value];
        return { ...prev, [field]: newArr };
      });
    },
    []
  );

  function next() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }
  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function finish() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        next(); // go to step 10 (done)
      }
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#1B6B4D] shadow-lg">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">
              Let&apos;s build your personalized meal plan
            </h1>
            <p className="mt-4 max-w-sm text-[#3A4A42]/70 leading-relaxed">
              Answer a few quick questions so we can recommend the best dishes for you from your company&apos;s restaurant. Takes about 3 minutes.
            </p>
            <Button onClick={next} size="xl" className="mt-8 rounded-xl">
              Let&apos;s go
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">About you</h2>
              <p className="mt-1 text-[#3A4A42]/70">Let&apos;s start with the basics</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">First name</label>
                <Input
                  value={data.firstName}
                  onChange={(e) => update({ firstName: e.target.value })}
                  placeholder="What should we call you?"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Age</label>
                <Input
                  type="number"
                  value={data.age}
                  onChange={(e) => update({ age: e.target.value })}
                  placeholder="30"
                  min={16}
                  max={100}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                    { value: "prefer_not_to_say", label: "Prefer not to say" },
                  ].map((opt) => (
                    <SelectionCard
                      key={opt.value}
                      label={opt.label}
                      selected={data.gender === opt.value}
                      onClick={() => update({ gender: opt.value })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Your body</h2>
              <p className="mt-1 text-[#3A4A42]/70">
                This helps us recommend the right portion sizes
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Height (cm)</label>
                <Input
                  type="number"
                  value={data.heightCm}
                  onChange={(e) => update({ heightCm: e.target.value })}
                  placeholder="170"
                  min={100}
                  max={250}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Current weight (kg)</label>
                <Input
                  type="number"
                  value={data.weightKg}
                  onChange={(e) => update({ weightKg: e.target.value })}
                  placeholder="70"
                  min={30}
                  max={300}
                />
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-[#1B6B4D]/5 p-3">
              <span className="mt-0.5 text-[#1B6B4D]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-xs text-[#1B6B4D]">
                Your data is private and never shared with your employer
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Your goal</h2>
              <p className="mt-1 text-[#3A4A42]/70">What&apos;s your main goal right now?</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "lose_weight", label: "Lose weight", icon: "🎯" },
                { value: "gain_muscle", label: "Build muscle", icon: "💪" },
                { value: "maintain", label: "Maintain my weight", icon: "⚖️" },
                { value: "energy", label: "More energy throughout the day", icon: "⚡" },
                { value: "general_health", label: "Just eat healthier", icon: "🌿" },
              ].map((opt) => (
                <SelectionCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={data.primaryGoal === opt.value}
                  onClick={() => update({ primaryGoal: opt.value })}
                />
              ))}
            </div>
            {data.primaryGoal === "lose_weight" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="mb-1.5 block text-sm font-medium">
                  Do you have a target weight in mind? (optional)
                </label>
                <Input
                  type="number"
                  value={data.targetWeightKg}
                  onChange={(e) => update({ targetWeightKg: e.target.value })}
                  placeholder="65"
                  min={30}
                  max={300}
                />
              </motion.div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">How you eat</h2>
              <p className="mt-1 text-[#3A4A42]/70">Tell us about your dietary preferences</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Any dietary preferences?</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "omnivore", label: "Omnivore" },
                  { value: "vegetarian", label: "Vegetarian" },
                  { value: "vegan", label: "Vegan" },
                  { value: "pescatarian", label: "Pescatarian" },
                ].map((opt) => (
                  <SelectionCard
                    key={opt.value}
                    label={opt.label}
                    selected={data.dietaryPreference === opt.value}
                    onClick={() => update({ dietaryPreference: opt.value })}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Any allergies or intolerances?
              </label>
              <ChipSelector
                options={[
                  "Nuts", "Gluten", "Dairy", "Eggs", "Soy",
                  "Shellfish", "Lactose intolerance", "None",
                ]}
                selected={data.allergies}
                onToggle={(opt) => toggleArrayField("allergies", opt)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Any foods you really don&apos;t like? <span className="text-[#3A4A42]/50">(optional)</span>
              </label>
              <Input
                value={data.dislikedFoods}
                onChange={(e) => update({ dislikedFoods: e.target.value })}
                placeholder="e.g., olives, mushrooms, cilantro"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Your activity level</h2>
              <p className="mt-1 text-[#3A4A42]/70">How active are you?</p>
            </div>
            <div className="space-y-3">
              {[
                { value: "sedentary", label: "Sedentary", desc: "Desk job, minimal movement", icon: "🪑" },
                { value: "lightly_active", label: "Lightly active", desc: "Some walking, light activity", icon: "🚶" },
                { value: "moderately_active", label: "Moderately active", desc: "Regular exercise 3-4x/week", icon: "🏃" },
                { value: "very_active", label: "Very active", desc: "Intense exercise 5+ times/week", icon: "🏋️" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ activityLevel: opt.value })}
                  className={`flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all duration-200 ${
                    data.activityLevel === opt.value
                      ? "border-[#27AE60] bg-[#27AE60]/5 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <span className={`font-medium ${data.activityLevel === opt.value ? "text-[#1B6B4D]" : "text-[#3A4A42]"}`}>
                      {opt.label}
                    </span>
                    <p className="text-sm text-[#3A4A42]/60">{opt.desc}</p>
                  </div>
                  {data.activityLevel === opt.value && (
                    <Check className="ml-auto h-5 w-5 text-[#27AE60]" />
                  )}
                </button>
              ))}
            </div>
            {(data.activityLevel === "moderately_active" || data.activityLevel === "very_active") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-sm font-medium">What type of exercise?</label>
                  <Input
                    value={data.exerciseType}
                    onChange={(e) => update({ exerciseType: e.target.value })}
                    placeholder="e.g., running, CrossFit, swimming"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">How many times per week?</label>
                  <div className="flex gap-3">
                    {[
                      { value: "1-2_per_week", label: "1-2" },
                      { value: "3-4_per_week", label: "3-4" },
                      { value: "5+_per_week", label: "5+" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update({ exerciseFrequency: opt.value })}
                        className={`flex-1 rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                          data.exerciseFrequency === opt.value
                            ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                            : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Health check</h2>
              <p className="mt-1 text-[#3A4A42]/70">
                This is optional but helps us make better recommendations
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Any health conditions we should know about?
              </label>
              <ChipSelector
                options={[
                  "Diabetes", "High blood pressure", "High cholesterol",
                  "IBS/digestive issues", "None",
                ]}
                selected={data.healthConditions}
                onToggle={(opt) => toggleArrayField("healthConditions", opt)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Currently taking any medications that affect your diet?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => update({ currentlyOnMedication: false, medicationNotes: "" })}
                  className={`flex-1 rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                    !data.currentlyOnMedication
                      ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                      : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => update({ currentlyOnMedication: true })}
                  className={`flex-1 rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                    data.currentlyOnMedication
                      ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                      : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                  }`}
                >
                  Yes
                </button>
              </div>
              {data.currentlyOnMedication && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3">
                  <Input
                    value={data.medicationNotes}
                    onChange={(e) => update({ medicationNotes: e.target.value })}
                    placeholder="Brief notes about your medication"
                  />
                </motion.div>
              )}
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-[#1B6B4D]/5 p-3">
              <span className="mt-0.5 text-[#1B6B4D]">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </span>
              <p className="text-xs text-[#1B6B4D]">
                Your data is private and never shared with your employer
              </p>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Eating habits</h2>
              <p className="mt-1 text-[#3A4A42]/70">A few more things about how you eat</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                How many meals do you usually eat per day?
              </label>
              <div className="flex gap-3">
                {["2", "3", "4", "5+"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update({ mealsPerDay: opt })}
                    className={`flex-1 rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                      data.mealsPerDay === opt
                        ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                        : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                How often do you snack between meals?
              </label>
              <div className="flex gap-3">
                {[
                  { value: "rarely", label: "Rarely" },
                  { value: "sometimes", label: "Sometimes" },
                  { value: "often", label: "Often" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ snackingHabit: opt.value })}
                    className={`flex-1 rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                      data.snackingHabit === opt.value
                        ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                        : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                How much water do you drink daily?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "less_than_1", label: "< 1 liter" },
                  { value: "1_to_2", label: "1-2 liters" },
                  { value: "2_to_3", label: "2-3 liters" },
                  { value: "more_than_3", label: "3+ liters" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update({ waterIntakeLiters: opt.value })}
                    className={`rounded-lg border-2 py-3 text-center text-sm font-medium transition-all ${
                      data.waterIntakeLiters === opt.value
                        ? "border-[#27AE60] bg-[#27AE60]/5 text-[#1B6B4D]"
                        : "border-gray-200 text-[#3A4A42] hover:border-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E]">Your biggest challenge</h2>
              <p className="mt-1 text-[#3A4A42]/70">
                This helps us personalize your recommendations even further
              </p>
            </div>
            <Textarea
              value={data.biggestNutritionChallenge}
              onChange={(e) => update({ biggestNutritionChallenge: e.target.value })}
              placeholder="e.g., I tend to overeat at lunch, I skip breakfast, I crave sweets in the afternoon..."
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-[#3A4A42]/50">
              This is optional, but it&apos;s the golden insight that helps our dietitian Noam give you better advice.
            </p>
          </div>
        );

      case 10:
        return (
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#27AE60] shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">You&apos;re all set! 🎉</h1>
            <p className="mt-4 max-w-sm text-[#3A4A42]/70 leading-relaxed">
              We&apos;ll send your personalized meal plan to your email every week based on what&apos;s being served at your company&apos;s restaurant.
            </p>

            <div className="mt-8 w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#3A4A42]/50">
                Your Profile Summary
              </h3>
              <div className="space-y-3 text-left text-sm">
                {data.primaryGoal && (
                  <div className="flex justify-between">
                    <span className="text-[#3A4A42]/70">Goal</span>
                    <span className="font-medium text-[#1A1A2E]">
                      {data.primaryGoal.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                )}
                {data.dietaryPreference && (
                  <div className="flex justify-between">
                    <span className="text-[#3A4A42]/70">Diet</span>
                    <span className="font-medium text-[#1A1A2E] capitalize">
                      {data.dietaryPreference}
                    </span>
                  </div>
                )}
                {data.activityLevel && (
                  <div className="flex justify-between">
                    <span className="text-[#3A4A42]/70">Activity</span>
                    <span className="font-medium text-[#1A1A2E]">
                      {data.activityLevel.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-6 text-sm text-[#27AE60] font-medium">
              Your first meal plan will arrive this Sunday
            </p>

            <Button
              onClick={() => router.push("/dashboard")}
              size="xl"
              className="mt-6 rounded-xl"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  }

  const showNav = step > 1 && step < 10;
  const isLastInput = step === 9;

  return (
    <div className="flex flex-1 flex-col">
      {step > 1 && step < 10 && (
        <div className="sticky top-0 z-10 bg-[#F7FAF8]/80 px-4 py-4 backdrop-blur-sm">
          <div className="mx-auto max-w-lg">
            <Progress value={step - 1} segments={TOTAL_STEPS - 2} />
            <p className="mt-2 text-center text-xs text-[#3A4A42]/50">
              Step {step - 1} of {TOTAL_STEPS - 2}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showNav && (
        <div className="sticky bottom-0 border-t border-gray-100 bg-white/80 px-4 py-4 backdrop-blur-sm">
          <div className="mx-auto flex max-w-lg justify-between">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            {isLastInput ? (
              <Button onClick={finish} disabled={saving}>
                {saving ? "Saving..." : "Finish"}
                <Check className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={next}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
