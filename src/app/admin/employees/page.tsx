"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Clock } from "lucide-react";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  onboardingCompleted: boolean;
  createdAt: string;
  lastPlanSent: string | null;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/employees")
      .then((r) => r.json())
      .then((d) => setEmployees(d.employees || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Employees</h1>
        <p className="mt-1 text-sm text-[#3A4A42]/60">
          {employees.length} registered employee{employees.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#27AE60] border-t-transparent" />
        </div>
      ) : employees.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-sm text-[#3A4A42]/60">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Onboarding</th>
                  <th className="px-6 py-3 font-medium">Last Plan</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-6 py-4 font-medium text-[#1A1A2E]">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3A4A42]/70">{emp.email}</td>
                    <td className="px-6 py-4">
                      {emp.onboardingCompleted ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </Badge>
                      ) : (
                        <Badge variant="amber" className="gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3A4A42]/70">
                      {emp.lastPlanSent
                        ? new Date(emp.lastPlanSent).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#3A4A42]/70">
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 font-semibold text-[#1A1A2E]">No employees yet</h3>
            <p className="mt-1 text-sm text-[#3A4A42]/60">Employees will appear here after they register</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
