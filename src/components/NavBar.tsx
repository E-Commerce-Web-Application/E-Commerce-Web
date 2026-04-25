import { Link } from "react-router";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, ShoppingCart } from "lucide-react";
import logo from "@/assets/logo.png";
import { useUser, UserButton } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { getCartByUserId } from "@/lib/api";

export default function NavBar() {
  const { user, isSignedIn } = useUser();
  const isMobile = useIsMobile();

  const cartQuery = useQuery({
    queryKey: ["cart-count", user?.id],
    queryFn: async () => getCartByUserId(user!.id),
    enabled: !!user?.id,
  });

  const cartItemsCount = (cartQuery.data?.items ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

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
      {isSignedIn && (
        <Link className="text-sm text-muted-foreground" to="/dashboard">
          Dashboard
        </Link>
      )}
      <Link className="text-sm text-muted-foreground" to="/cart">
        Cart
      </Link>
    </>
  );

  const AuthButtons = () => (
    <>
      {isSignedIn ? (
        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-black" />
            {cartItemsCount > 0 ? (
              <span className="absolute -top-2 -right-2 text-[10px] w-4 h-4 rounded-full bg-[#f87941] text-white flex items-center justify-center">
                {cartItemsCount}
              </span>
            ) : null}
          </Link>
          <UserButton />
        </div>
      ) : (
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
      )}
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
