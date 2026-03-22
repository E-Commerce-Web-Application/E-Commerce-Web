import { Link } from "react-router";
import { Button } from "./ui/button";
import { useUserStore } from "@/stores/user.store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import logo from "@/assets/logo.png";

export default function NavBar() {
  const { user } = useUserStore();
  const isMobile = useIsMobile();

  const Logo = () => (
    <div className="flex justify-start items-center">
      <div className="w-16 h-16 flex justify-center items-center">
        <img src={logo} alt="WoolWorld logo" className="w-full h-full object-contain" />
      </div>
      <h4 className="text-sm font-semibold">WoolWorld</h4>
    </div>
  );

  const NavLinks = () => (
    <>
      <Link className="text-sm text-muted-foreground" to="/">
        Home
      </Link>
      {user && (
        <Link className="text-sm text-muted-foreground" to="/dashboard">
          Dashboard
        </Link>
      )}
    </>
  );

  const AuthButtons = () => (
    <>
      <Link
        to="/auth/login"
        className="text-xs font-semibold text-black cursor-pointer"
      >
        LOG IN
      </Link>
      <Button variant="default" size="sm" className="text-xs bg-[#f87941]">
        <Link to="/auth/register">GET STARTED</Link>
      </Button>
    </>
  );

  if (isMobile) {
    return (
      <nav className="w-full h-15 bg-[#f8f6fc] border flex justify-between items-center px-4 py-3">
        <Logo />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-62.5 p-6">
            <SheetHeader className="mb-8">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <NavLinks />
              </div>
              <div className="flex flex-col gap-3 pt-4 border-t">
                <AuthButtons />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    );
  }

  return (
    <nav className="w-full h-15 bg-[#f8f6fc] border flex justify-between items-center px-[15%]">
      <div className="w-auto flex justify-start items-center gap-8">
        <Logo />
        <div className="w-auto h-full flex justify-start items-center gap-5">
          <NavLinks />
        </div>
      </div>
      <div className="w-auto flex justify-start items-center gap-5">
        <AuthButtons />
      </div>
    </nav>
  );
}
