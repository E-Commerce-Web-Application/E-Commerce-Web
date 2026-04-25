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
import axiosInstance from "@/providers/axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";

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
  const userQuery = useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/self");

      return res.data;
    },
    retryOnMount: true,
    refetchOnReconnect: true,
  });
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
        <NavUser user={userQuery.data?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
