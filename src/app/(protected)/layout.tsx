"use client";

import { AuthProvider } from "@/lib/auth";
import { AuthGate } from "@/components/admin/auth-gate";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
