"use client";

import { TamboProvider } from "@tambo-ai/react";
import { tamboComponents } from "@/lib/tambo/registry";
import { ReactNode } from "react";

interface TamboWrapperProps {
  children: ReactNode;
}

export function TamboWrapper({ children }: TamboWrapperProps) {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={tamboComponents}
    >
      {children}
    </TamboProvider>
  );
}
