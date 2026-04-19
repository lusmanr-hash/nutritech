"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";

interface MenuItem {
  id: string;
  dayOfWeek: string;
  mealType: string;
  name: string;
  description: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  tags: string;
}

interface WeeklyMenu {
  id: string;
  weekStartDate: string;
  menuItems: MenuItem[];
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const TAG_OPTIONS = [
  "vegetarian", "vegan", "gluten_free", "dairy_free",
  "high_protein", "low_carb", "spicy",
];

const emptyItem = {
  dayOfWeek: "sunday",
  mealType: "lunch",
  name: "",
  description: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  selectedTags: [] as string[],
};

export default function MenuPage() {
  const [menu, setMenu] = useState<WeeklyMenu | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyItem });
  const [saving, setSaving] = useState(false);

  async function loadMenu() {
    setLoading(true);
    const res = await fetch("/api/menu");
    if (res.ok) {
      const data = await res.json();
      setMenu(data.menu);
    }
    setLoading(false);
  }

  useEffect(() => { loadMenu(); }, []);

  async function addItem() {
    setSaving(true);
    const body = {
      dayOfWeek: form.dayOfWeek,
      mealType: form.mealType,
      name: form.name,
      description: form.description,
      calories: form.calories ? parseInt(form.calories) : null,
      protein: form.protein ? parseFloat(form.protein) : null,
      carbs: form.carbs ? parseFloat(form.carbs) : null,
      fat: form.fat ? parseFloat(form.fat) : null,
      tags: JSON.stringify(form.selectedTags),
    };
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setForm({ ...emptyItem });
      setShowForm(false);
      loadMenu();
    }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    await fetch(`/api/menu?id=${id}`, { method: "DELETE" });
    loadMenu();
  }

  const groupedItems: Record<string, MenuItem[]> = {};
  if (menu?.menuItems) {
    for (const item of menu.menuItems) {
      if (!groupedItems[item.dayOfWeek]) groupedItems[item.dayOfWeek] = [];
      groupedItems[item.dayOfWeek].push(item);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Menu Management</h1>
          <p className="mt-1 text-sm text-[#3A4A42]/60">
            {menu ? `Week of ${new Date(menu.weekStartDate).toLocaleDateString()}` : "No menu yet"}
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Dish
        </Button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add Menu Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Day</label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Meal Type</label>
                <select
                  value={form.mealType}
                  onChange={(e) => setForm({ ...form, mealType: e.target.value })}
                  className="flex h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Dish Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Grilled Chicken Salad"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description of the dish"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Calories</label>
                <Input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} placeholder="450" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Protein (g)</label>
                <Input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: e.target.value })} placeholder="35" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Carbs (g)</label>
                <Input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: e.target.value })} placeholder="40" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Fat (g)</label>
                <Input type="number" value={form.fat} onChange={(e) => setForm({ ...form, fat: e.target.value })} placeholder="15" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const sel = form.selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          selectedTags: sel
                            ? form.selectedTags.filter((t) => t !== tag)
                            : [...form.selectedTags, tag],
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        sel ? "bg-[#27AE60] text-white" : "bg-gray-100 text-[#3A4A42] hover:bg-gray-200"
                      }`}
                    >
                      {tag.replace(/_/g, " ")}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={addItem} disabled={!form.name || saving}>
                {saving ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Display */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#27AE60] border-t-transparent" />
        </div>
      ) : DAYS.map((day) => {
        const items = groupedItems[day] || [];
        if (items.length === 0) return null;
        return (
          <Card key={day} className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg capitalize">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => {
                  const tags: string[] = item.tags ? JSON.parse(item.tags) : [];
                  return (
                    <div key={item.id} className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className="h-4 w-4 text-[#27AE60]" />
                          <span className="font-medium text-[#1A1A2E]">{item.name}</span>
                          <Badge variant="outline" className="text-xs capitalize">{item.mealType}</Badge>
                        </div>
                        {item.description && <p className="mt-1 text-sm text-[#3A4A42]/60">{item.description}</p>}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {item.calories && <Badge variant="secondary">{item.calories} cal</Badge>}
                          {tags.map((t) => <Badge key={t} variant="outline">{t.replace(/_/g, " ")}</Badge>)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-red-400 hover:text-red-600" onClick={() => deleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {!loading && (!menu || menu.menuItems.length === 0) && (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <UtensilsCrossed className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-semibold text-[#1A1A2E]">No menu items yet</h3>
            <p className="mt-1 text-sm text-[#3A4A42]/60">Click &quot;Add Dish&quot; to start building this week&apos;s menu</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
