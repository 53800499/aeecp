/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentification - Dashboard Financier",
  description: "Connectez-vous à votre compte"
};

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      {children}
    </div>
  );
}

