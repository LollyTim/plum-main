
import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import React from "react";

export const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "https://lucky-gerbil-581.convex.cloud"
);

export function ConvexProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
