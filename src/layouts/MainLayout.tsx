import type { ReactNode } from "react";
import { Header } from "@/components/navigation/Header";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  );
}
