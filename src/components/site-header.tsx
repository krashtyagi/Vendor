'use client'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
// import { data } from "./app-sidebar"
import { NavUser } from "./nav-user"
import { IconNotification, IconSettings } from "@tabler/icons-react"
import { ModeToggle } from "./ui/toggle-theme"
import { Spinner } from "./ui/spinner"
import { Suspense } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  
  

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{pathname.split("/")[1].toUpperCase()}</h1>
        <div className="ml-auto flex items-center gap-2">
            <NavUser />

          {/* <Button variant={"ghost"}>
            <IconSettings />
          </Button>
          <Button variant={"ghost"} >
            <IconNotification />

          </Button> */}
          <ModeToggle/>
        </div>
      </div>
    </header>
  )
}
