/*
PlayArena.fun — App Frame
- Shared background + header + footer
*/

import type { ReactNode } from "react";
import BackgroundFX from "@/components/BackgroundFX";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

export default function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <BackgroundFX />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
