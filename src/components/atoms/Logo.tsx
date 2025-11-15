/** @format */

import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <Wallet className="h-6 w-6 text-white" />
      </div>
      <span className="font-bold text-lg">AEECP</span>
    </div>
  );
}
