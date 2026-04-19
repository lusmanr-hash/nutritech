import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create company
  const company = await prisma.company.create({
    data: { name: "TechFlow Inc." },
  });
  console.log("Created company:", company.name);

  // Create admin user
  const adminHash = await bcrypt.hash("password123", 10);
  const admin = await prisma.employee.create({
    data: {
      email: "admin@nutritech.com",
      passwordHash: adminHash,
      firstName: "Noam",
      lastName: "Radlich",
      companyId: company.id,
      role: "admin",
      onboardingCompleted: true,
    },
  });
  console.log("Created admin:", admin.email);

  // Create test employee
  const empHash = await bcrypt.hash("password123", 10);
  const employee = await prisma.employee.create({
    data: {
      email: "demo@nutritech.com",
      passwordHash: empHash,
      firstName: "Sarah",
      lastName: "Chen",
      companyId: company.id,
      onboardingCompleted: true,
    },
  });

  // Create employee profile
  await prisma.employeeProfile.create({
    data: {
      employeeId: employee.id,
      age: 29,
      gender: "female",
      heightCm: 165,
      weightKg: 62,
      primaryGoal: "energy",
      dietaryPreference: "omnivore",
      allergies: JSON.stringify(["Dairy"]),
      activityLevel: "moderately_active",
      exerciseFrequency: "3-4_per_week",
      exerciseType: "yoga, running",
      healthConditions: JSON.stringify([]),
      mealsPerDay: "3",
      snackingHabit: "sometimes",
      waterIntakeLiters: "1_to_2",
      biggestNutritionChallenge:
        "I tend to crash after lunch and reach for sweets in the afternoon",
    },
  });
  console.log("Created employee:", employee.email);

  // Create weekly menu (this week)
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);

  const menu = await prisma.weeklyMenu.create({
    data: {
      companyId: company.id,
      weekStartDate: weekStart,
    },
  });

  const menuItems = [
    { dayOfWeek: "sunday", mealType: "lunch", name: "Grilled Chicken Caesar Salad", description: "Romaine lettuce, grilled chicken breast, parmesan, croutons, caesar dressing", calories: 420, protein: 38, carbs: 22, fat: 20, tags: JSON.stringify(["high_protein"]) },
    { dayOfWeek: "sunday", mealType: "lunch", name: "Mushroom Risotto", description: "Arborio rice, mixed mushrooms, parmesan, white wine, truffle oil", calories: 520, protein: 14, carbs: 68, fat: 22, tags: JSON.stringify(["vegetarian"]) },
    { dayOfWeek: "sunday", mealType: "lunch", name: "Teriyaki Salmon Bowl", description: "Grilled salmon, brown rice, edamame, avocado, teriyaki glaze", calories: 580, protein: 42, carbs: 52, fat: 22, tags: JSON.stringify(["high_protein", "dairy_free"]) },
    { dayOfWeek: "monday", mealType: "lunch", name: "Mediterranean Quinoa Bowl", description: "Quinoa, chickpeas, cucumber, tomatoes, olives, feta, lemon-herb dressing", calories: 460, protein: 18, carbs: 54, fat: 20, tags: JSON.stringify(["vegetarian", "high_protein"]) },
    { dayOfWeek: "monday", mealType: "lunch", name: "BBQ Pulled Chicken Sandwich", description: "Slow-cooked chicken, BBQ sauce, coleslaw, brioche bun, sweet potato fries", calories: 680, protein: 35, carbs: 72, fat: 28, tags: JSON.stringify(["dairy_free"]) },
    { dayOfWeek: "monday", mealType: "lunch", name: "Thai Green Curry", description: "Vegetables and tofu in coconut green curry, jasmine rice", calories: 490, protein: 16, carbs: 58, fat: 24, tags: JSON.stringify(["vegan", "gluten_free", "spicy"]) },
    { dayOfWeek: "tuesday", mealType: "lunch", name: "Grilled Steak Fajitas", description: "Marinated flank steak, peppers, onions, guacamole, flour tortillas", calories: 620, protein: 42, carbs: 48, fat: 28, tags: JSON.stringify(["high_protein"]) },
    { dayOfWeek: "tuesday", mealType: "lunch", name: "Roasted Vegetable Pasta", description: "Penne, roasted zucchini, bell peppers, cherry tomatoes, basil pesto", calories: 510, protein: 16, carbs: 62, fat: 24, tags: JSON.stringify(["vegetarian"]) },
    { dayOfWeek: "tuesday", mealType: "lunch", name: "Seared Tuna Nicoise Salad", description: "Seared ahi tuna, green beans, potatoes, olives, eggs, vinaigrette", calories: 440, protein: 36, carbs: 28, fat: 22, tags: JSON.stringify(["high_protein", "gluten_free", "dairy_free"]) },
    { dayOfWeek: "wednesday", mealType: "lunch", name: "Chicken Shawarma Plate", description: "Spiced chicken thighs, hummus, tabbouleh, pickles, pita bread", calories: 560, protein: 38, carbs: 46, fat: 24, tags: JSON.stringify(["high_protein", "dairy_free"]) },
    { dayOfWeek: "wednesday", mealType: "lunch", name: "Black Bean & Sweet Potato Burrito Bowl", description: "Black beans, roasted sweet potato, corn, avocado, salsa, lime rice", calories: 520, protein: 20, carbs: 72, fat: 18, tags: JSON.stringify(["vegan", "gluten_free"]) },
    { dayOfWeek: "wednesday", mealType: "lunch", name: "Classic Margherita Pizza", description: "Fresh mozzarella, tomato sauce, basil, olive oil on thin crust", calories: 640, protein: 24, carbs: 68, fat: 30, tags: JSON.stringify(["vegetarian"]) },
    { dayOfWeek: "thursday", mealType: "lunch", name: "Herb-Crusted Salmon Fillet", description: "Atlantic salmon, herb crust, roasted asparagus, lemon butter sauce, quinoa", calories: 520, protein: 44, carbs: 32, fat: 24, tags: JSON.stringify(["high_protein", "gluten_free"]) },
    { dayOfWeek: "thursday", mealType: "lunch", name: "Falafel Wrap", description: "Crispy falafel, hummus, tahini, mixed greens, tomatoes, whole wheat wrap", calories: 480, protein: 18, carbs: 56, fat: 22, tags: JSON.stringify(["vegan"]) },
    { dayOfWeek: "thursday", mealType: "lunch", name: "Korean Beef Bibimbap", description: "Marinated beef, mixed vegetables, fried egg, gochujang, steamed rice", calories: 600, protein: 34, carbs: 64, fat: 22, tags: JSON.stringify(["spicy", "dairy_free"]) },
    { dayOfWeek: "friday", mealType: "lunch", name: "Grilled Chicken Pesto Panini", description: "Grilled chicken, mozzarella, sun-dried tomatoes, basil pesto, ciabatta", calories: 580, protein: 36, carbs: 44, fat: 28, tags: JSON.stringify(["high_protein"]) },
    { dayOfWeek: "friday", mealType: "lunch", name: "Poke Bowl", description: "Fresh ahi tuna, sushi rice, mango, edamame, seaweed, ponzu dressing", calories: 460, protein: 32, carbs: 52, fat: 14, tags: JSON.stringify(["high_protein", "dairy_free"]) },
    { dayOfWeek: "friday", mealType: "lunch", name: "Eggplant Parmesan", description: "Breaded eggplant, marinara sauce, mozzarella, spaghetti", calories: 560, protein: 20, carbs: 58, fat: 28, tags: JSON.stringify(["vegetarian"]) },
  ];

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: { weeklyMenuId: menu.id, ...item },
    });
  }
  console.log(`Created ${menuItems.length} menu items`);

  console.log("\nSeed complete!");
  console.log("Admin login: admin@nutritech.com / password123");
  console.log("Employee login: demo@nutritech.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
