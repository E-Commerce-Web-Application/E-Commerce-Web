import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useClerk, useUser } from "@clerk/react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Shops",
      url: "/dashboard/shops",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create",
          url: "/dashboard/shops/create",
        },
        {
          title: "My Shops",
          url: "/dashboard/shops",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Bot,
      items: [
        {
          title: "Create",
          url: "/dashboard/products/create",
        },
        {
          title: "My Products",
          url: "/dashboard/products",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const sidebarUser = {
    fullName: user?.fullName || user?.firstName || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-[#f8f6fc]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link to="/">
                <div className="flex justify-start items-center">
                  <div className="w-12 h-12 flex justify-center items-center">
                    <img
                      src={logo}
                      alt="WoolWorld logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-medium">WoolWorld</h4>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={sidebarUser}
          onLogout={() => {
            signOut({ redirectUrl: "/" });
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
