import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";
import QueryClientProviderCom from "@/providers/QueryClientProvider.tsx";
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <QueryClientProviderCom>
    <App />
    <Toaster />
  </QueryClientProviderCom>,
);
