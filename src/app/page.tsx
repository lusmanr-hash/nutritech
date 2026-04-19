"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email, password }
          : { email, password, firstName, lastName };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      if (data.onboardingCompleted) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1B6B4D] shadow-lg">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[#1A1A2E]">NutriTech</h1>
          <p className="mt-2 text-[#3A4A42]/70">
            Personalized nutrition from your company&apos;s kitchen
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "login"
                    ? "bg-white text-[#1A1A2E] shadow-sm"
                    : "text-[#3A4A42]/60 hover:text-[#3A4A42]"
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => { setMode("register"); setError(""); }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
                  mode === "register"
                    ? "bg-white text-[#1A1A2E] shadow-sm"
                    : "text-[#3A4A42]/60 hover:text-[#3A4A42]"
                }`}
              >
                Sign up
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3A4A42]">
                      First name
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#3A4A42]">
                      Last name
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A4A42]">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#3A4A42]">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="animate-pulse">Please wait...</span>
                ) : mode === "login" ? (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[#3A4A42]/50">
          Demo: admin@nutritech.com / password123
        </p>
      </div>
    </div>
  );
}
