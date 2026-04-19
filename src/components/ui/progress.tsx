"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  segments?: number;
}

function Progress({ value, max = 100, segments, className, ...props }: ProgressProps) {
  const percentage = (value / max) * 100;

  if (segments) {
    return (
      <div className={cn("flex gap-1.5", className)} {...props}>
        {Array.from({ length: segments }, (_, i) => {
          const segmentFilled = i < value;
          return (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                segmentFilled ? "bg-[#27AE60]" : "bg-gray-200"
              )}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[#27AE60] transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
