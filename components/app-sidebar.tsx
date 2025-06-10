"use client";

import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";

const data = {
  chats: [
    {
      title: "Today",
      items: [
        {
          title: "Installation",
          id: "1",
        },
        {
          title: "Project Structure",
          id: "2",
        },
      ],
    },
    {
      title: "This week",
      items: [
        {
          title: "Routing",
          id: "3",
        },
        {
          title: "Data Fetching",
          id: "4",
        },
        {
          title: "Rendering",
          id: "5",
        },
        {
          title: "Caching",
          id: "6",
        },
        {
          title: "Styling",
          id: "7",
        },
        {
          title: "Optimizing",
          id: "8",
        },
        {
          title: "Configuring",
          id: "9",
        },
        {
          title: "Testing",
          id: "10",
        },
        {
          title: "Authentication",
          id: "11",
        },
        {
          title: "Deploying",
          id: "12",
        },
        {
          title: "Upgrading",
          id: "13",
        },
        {
          title: "Examples",
          id: "14",
        },
      ],
    },
    {
      title: "This month",
      items: [
        {
          title: "Components",
          id: "15",
        },
        {
          title: "File Conventions",
          id: "16",
        },
        {
          title: "Functions",
          id: "17",
        },
        {
          title: "next.config.js Options",
          id: "18",
        },
        {
          title: "CLI",
          id: "19",
        },
        {
          title: "Edge Runtime",
          id: "20",
        },
      ],
    },
  ],
  user: {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://github.com/shadcn.png",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BotMessageSquare className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-lg">K3 Chat</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem className="px-2">
            <Button className="w-full" asChild>
              <Link href="/">New chat</Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.chats.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/${item.id}`}
                    >
                      <Link href={`/${item.id}`}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
