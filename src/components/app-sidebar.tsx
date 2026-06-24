"use client"

import * as React from "react"
import {
  IconBike,
  IconBuildingCommunity,
  IconCalendar,
  IconCar,
  IconDashboard,
  IconDatabase,
  IconDiscount2,
  IconFileInvoice,
  IconHome,
  IconListDetails,
  IconMapPin,
  IconMessage,
  IconMountain,
  IconPhone,
  IconSpeakerphone,
  IconTag,
  IconTower,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import LOGO from "./logo/logo"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export const data = {
  user: {
    name: "Joylan dorwart",
    email: "admin@gmail.com",
    avatar: "/girl.png",
  },
  navMain: {
    hotel: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Reservation", url: "/reservation", icon: IconListDetails },
      { title: "Rooms", url: "/rooms", icon: IconHome },
      { title: "Calendar", url: "/calendar", icon: IconCalendar },
      { title: "Reviews", url: "/reviews", icon: IconMessage },
      { title: "Invoice", url: "/invoice", icon: IconFileInvoice },
      { title: "Advertisements", url: "/advertisements", icon: IconSpeakerphone },
      { title: "Promotions", url: "/promotions", icon: IconDiscount2 },
      { title: "Listing", url: "/listing", icon: IconBuildingCommunity }
    ],
    adventure: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Reservation", url: "/reservation", icon: IconListDetails },
      { title: "Adventure", url: "/adventures", icon: IconMountain },
      { title: "Reviews", url: "/reviews", icon: IconMessage },
      { title: "Invoice", url: "/invoice", icon: IconFileInvoice },
      { title: "Advertisements", url: "/advertisements", icon: IconSpeakerphone },
      { title: "Promotions", url: "/promotions", icon: IconDiscount2 },
      { title: "Listing", url: "/listing", icon: IconMapPin }
    ],
    cab: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Reservation", url: "/reservation", icon: IconListDetails },
      { title: "Cabs", url: "/cabs", icon: IconCar },
      { title: "Reviews", url: "/reviews", icon: IconMessage },
      { title: "Invoice", url: "/invoice", icon: IconFileInvoice },
      { title: "Advertisements", url: "/advertisements", icon: IconSpeakerphone },
      { title: "Promotions", url: "/promotions", icon: IconDiscount2 },
      { title: "Listing", url: "/listing", icon: IconMapPin }
    ],
    bike: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Reservation", url: "/reservation", icon: IconListDetails },
      { title: "Bikes", url: "/bikes", icon: IconBike },
      { title: "Reviews", url: "/reviews", icon: IconMessage },
      { title: "Invoice", url: "/invoice", icon: IconFileInvoice },
      { title: "Advertisements", url: "/advertisements", icon: IconSpeakerphone },
      { title: "Promotions", url: "/promotions", icon: IconDiscount2 },
      { title: "Listing", url: "/listing", icon: IconMapPin }
    ],
    tour: [
      { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
      { title: "Reservation", url: "/reservation", icon: IconListDetails },
      { title: "Tours", url: "/tours", icon: IconTower },
      { title: "Reviews", url: "/reviews", icon: IconMessage },
      { title: "Invoice", url: "/invoice", icon: IconFileInvoice },
      { title: "Advertisements", url: "/advertisements", icon: IconSpeakerphone },
      { title: "Promotions", url: "/promotions", icon: IconDiscount2 },
      { title: "Listing", url: "/listing", icon: IconMapPin }
    ],
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const [currCategory, setCurrCategory] = React.useState<keyof typeof data.navMain>("hotel");

  React.useEffect(() => {
    const savedCategory = localStorage.getItem("category") as keyof typeof data.navMain;
    if (savedCategory && data.navMain[savedCategory]) {
      setCurrCategory(savedCategory);
    }

    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const activeNavigationItems = data.navMain[currCategory] || data.navMain.hotel;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5">
              <React.Suspense fallback={<div><Loader2 className="animate-spin" /></div>}>
                <LOGO />
              </React.Suspense>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={activeNavigationItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}