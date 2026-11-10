"use client";

import * as React from "react";
import { Plus, Building2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useVendorProperties, useSwitchProperty } from "@/services/property.query";
import { useCurrentUser } from "@/services/queryes";
import { cn } from "@/lib/utils";

export function PropertySwitcher() {
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: userData } = useCurrentUser();
  const { data: propertiesData, isLoading } = useVendorProperties();
  const switchMutation = useSwitchProperty();
  const [switchingId, setSwitchingId] = React.useState<string | null>(null);

  const approvedData = userData?.data?.approvedData;
  const properties = propertiesData?.data?.properties || [];
  const activePropertyId = propertiesData?.data?.activePropertyId;

  // Only show for approved vendors with service type hotel or tour
  const serviceType = approvedData?.serviceType;
  if (!serviceType || !["hotel", "tour"].includes(serviceType)) return null;

  const handleSwitch = async (propertyId: string) => {
    if (isMobile) {
      setOpenMobile(false);
    }
    if (propertyId === activePropertyId) return;

    try {
      setSwitchingId(propertyId);
      const result = await switchMutation.mutateAsync(propertyId);
      if (result?.success) {
        toast.success(`Switched to ${result.data?.name || "property"}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to switch property");
    } finally {
      setSwitchingId(null);
    }
  };

  const MAX_PROPERTIES = 50;
  const isLimitReached = properties.length >= MAX_PROPERTIES;

  const handleAddProperty = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    if (isLimitReached) {
      toast.error(`Maximum limit of ${MAX_PROPERTIES} properties reached`);
      return;
    }
    router.push("/settings/add-property");
  };

  const entityName = serviceType === "tour" ? "Tour" : "Hotel";

  if (isLoading) {
    return (
      <SidebarGroup className="p-0 px-2 mt-2">
        <SidebarGroupContent>
          <div className="w-full flex items-center gap-2 px-2 py-1.5 opacity-60">
            <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="p-0 px-2 mt-2 border-t border-sidebar-border/60 pt-2">
      <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2.5 h-7">
        {entityName} Properties
      </SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-1 mt-0.5">
        <SidebarMenu>
          {properties.map((property: any) => {
            const isActive =
              property._id === activePropertyId || property.isCurrentlyActive;
            const isVerified =
              property.verificationStatus === "verified" && property.isActive;
            const isSwitching =
              switchMutation.isPending && switchingId === property._id;

            return (
              <SidebarMenuItem key={property._id}>
                <SidebarMenuButton
                  tooltip={property.name}
                  disabled={!isVerified || switchMutation.isPending}
                  onClick={() => isVerified && handleSwitch(property._id)}
                  className={cn(
                    "cursor-pointer font-medium",
                    isActive
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/60 text-sidebar-foreground",
                    !isVerified && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "relative h-5 w-5 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-muted/40 transition-all",
                      isActive
                        ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-sidebar"
                        : "border border-border/60 opacity-80"
                    )}
                  >
                    {isSwitching ? (
                      <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />
                    ) : property.image ? (
                      <img
                        src={property.image}
                        alt={property.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>

                  <span className="truncate">
                    {property.name}
                  </span>

                  {isSwitching && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-500 shrink-0 ml-auto" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          {!isLimitReached && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={`Add ${entityName}`}
                onClick={handleAddProperty}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <div className="h-5 w-5 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center shrink-0 group-hover/menu-button:border-emerald-500 group-hover/menu-button:text-emerald-500 transition-colors">
                  <Plus className="h-3 w-3" />
                </div>
                <span className="truncate">
                  Add {entityName}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
