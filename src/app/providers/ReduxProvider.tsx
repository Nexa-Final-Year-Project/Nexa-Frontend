// app/providers.tsx
"use client";
import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { baseApi } from "@/api/baseApi";

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <ApiProvider api={baseApi}>
      <MantineProvider>{children}</MantineProvider>
    </ApiProvider>
  );
}
