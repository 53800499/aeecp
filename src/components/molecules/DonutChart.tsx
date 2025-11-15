/** @format */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonutChartProps {
  title: string;
  data: { label: string; value: number; color: string; percentage: number }[];
  centerText?: string;
  centerValue?: string;
  className?: string;
}

export function DonutChart({
  title,
  data,
  centerText,
  centerValue,
  className
}: DonutChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Donut Chart visuel simplifié */}
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="transform -rotate-90">
              {data.map((item, index) => {
                const previousPercentage = data
                  .slice(0, index)
                  .reduce((sum, d) => sum + d.percentage, 0);
                const strokeDasharray = `${item.percentage} ${
                  100 - item.percentage
                }`;
                const strokeDashoffset = -previousPercentage;

                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="15.9"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all"
                  />
                );
              })}
            </svg>
            {centerValue && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-xl md:text-2xl font-bold">{centerValue}</div>
                {centerText && (
                  <div className="text-xs text-muted-foreground">
                    {centerText}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Légende */}
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
