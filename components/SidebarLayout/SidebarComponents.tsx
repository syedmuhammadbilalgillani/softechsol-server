"use client";

import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import LogoutButton from "../logout-button";

export const SidebarHead = () => {
  // const user = useUserStore((state) => state.user) as User | null;
  const router = useRouter();
  // const { hasPermission } = usePermission();
  // const isStoreEdit = hasPermission(PERMISSIONS.STOREMANAGEMENT);

  return (
    <div className="flex flex-col items-center justify-center py-4 px-2 rounded-lg transition-colors duration-200 cursor-pointer group">
      <div className="relative mb-2">
        {/* {companyLogo} */}
        {/* {isStoreEdit && ( */}
        <div
          onClick={() => router.push("/admin/store/edit")}
          className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-700 p-0.5 px-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 group-amber-500 dark:group-amber-500 transition-colors duration-200"
        >
          <i className="fa-duotone fa-solid fa-pen text-xs rounded-full"></i>
        </div>
        {/* // )} */}
      </div>

      <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs px-2 py-1 rounded-md -top-8 whitespace-nowrap">
        Edit store details
      </div>
    </div>
  );
};

export function NavMain({
  items,
}: {
  items: {
    label: string;
    items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
      requiredPermissions?: string[];
      items?: {
        title: string;
        url: string;
        requiredPermissions?: string[];
      }[];
    }[];
  }[];
}) {
  return (
    <>
      {items?.map((group) => (
        <SidebarGroup key={group?.label}>
          <SidebarGroupLabel>
            {/* <TranslatedText textKey={group?.label} /> */}
            {group?.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {group?.items?.map((item) =>
              item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item?.title}
                  asChild
                  defaultOpen={item?.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item?.title}>
                        {item?.icon && <item.icon />}
                        <span>
                          {/* <TranslatedText textKey={item?.title ?? ""} /> */}
                          {item?.title}
                        </span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item?.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem?.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem?.url}>
                                <span>
                                  {/* <TranslatedText textKey={subItem?.title} /> */}
                                  {subItem?.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item?.title}>
                  <Link href={item?.url}>
                    <SidebarMenuButton tooltip={item?.title}>
                      {item?.icon && <item.icon />}
                      <span>
                        {/* <TranslatedText textKey={item?.title ?? ""} /> */}
                        {item?.title}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
export const SidebarFooterMenu = () => {
  // const router = useRouter();
  // const user = useUserStore((state) => state.user) as User | null;
  // const clearTenant = useTenantStore((state) => state.clearTenant);
  // const clearUser = useUserStore((state) => state.clearUser);
  // const [isLoading, setIsLoading] = useState(false);

  // const handleLogout = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await Logout();
  //     toast.success(res.message);
  //     clearTenant();
  //     clearUser();
  //     Cookies.remove("accessToken");
  //     Cookies.remove("user-storage");
  //     Cookies.remove("tenant-storage");

  //     router.push("/");
  //     localStorage.clear();
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 200);
  //   } catch (error: unknown) {
  //     setIsLoading(false);
  //     const errorMessage =
  //       error instanceof Error ? error.message : "Unknown error";
  //     toast.error(`Error during logout ${errorMessage}`);
  //   }
  // }, [router, clearUser, clearTenant]);

  return (
    <>
      {/* <Spinner isLoading={isLoading} /> */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-nowrap">
                  {/* <User2 /> {user?.firstName ?? ""} {user?.lastName ?? ""} */}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <LogoutButton />

                {/* <DropdownMenuItem></DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem> */}
                {/* <DropdownMenuItem onClick={handleLogout}>
                  Sign out
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem></DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
};
