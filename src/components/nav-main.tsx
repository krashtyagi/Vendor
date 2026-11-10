"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface NavItem {
  title: string
  url: string
  icon?: any
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export function NavMain({
  sections,
  items,
}: {
  sections?: NavSection[]
  items?: NavItem[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavigation = (url: string) => {
    if (isMobile) {
      setOpenMobile(false)
    }
    if (pathname === url) return
    router.push(url)
  }

  const effectiveSections: NavSection[] = sections || [
    {
      items: items || [],
    },
  ]

  return (
    <div className="flex flex-col gap-3 py-1">
      {effectiveSections.map((section, idx) => (
        <SidebarGroup key={section.title || idx} className="p-0 px-2">
          {section.title && (
            <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5 h-7">
              {section.title}
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent className="flex flex-col gap-1 mt-0.5">
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url))
                const IconComp = item.icon

                return (
                  <SidebarMenuItem
                    key={item.title}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "cursor-pointer font-medium",
                        isActive &&
                          "bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-medium"
                      )}
                    >
                      {IconComp &&
                        (React.isValidElement(IconComp) ? (
                          IconComp
                        ) : (
                          <IconComp size={18} className="shrink-0" />
                        ))}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </div>
  )
}
