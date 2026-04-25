import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import QueryClientProviderCom from "@/providers/QueryClientProvider.tsx";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/react";

createRoot(document.getElementById("root")!).render(
  <QueryClientProviderCom>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string}
    >
      <App />
    </ClerkProvider>
    <Toaster />
  </QueryClientProviderCom>,
);
