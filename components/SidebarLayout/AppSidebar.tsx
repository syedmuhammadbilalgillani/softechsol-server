"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavMain, SidebarFooterMenu, SidebarHead } from "./SidebarComponents";
import { navigation } from "./navigationItems";

function AppSidebar() {
  // const navigation = usePermissionBasedNavigation();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHead />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <NavMain items={navigation} />
        </SidebarGroup>
      </SidebarContent>

      <div className="flex justify-evenly p-2">
        {/* <LanguageSwitcher />
        <ThemeSwitch /> */}
      </div>

      <SidebarFooterMenu />
    </Sidebar>
  );
}
export default AppSidebar;
