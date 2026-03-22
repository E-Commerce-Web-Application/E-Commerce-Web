import { Outlet } from "react-router";
import AuthNav from "@/components/AuthNav";

export default function AuthLayout() {
  return (
    <main>
      <header className="w-full h-auto">
        <AuthNav />
      </header>
      <Outlet />
    </main>
  );
}
