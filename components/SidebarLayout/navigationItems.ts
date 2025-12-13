import {
  Briefcase,
  Building2,
  Folder,
  Home,
  Image,
  Newspaper,
  Tag,
  Type,
  Radio,
  Layers,
  Wrench,
  Users,
  Database,
} from "lucide-react";

export const navigation = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
        isActive: true,
      },
      {
        title: "Category",
        url: "/category",
        icon: Type,
        isActive: false,
      },
      {
        title: "Blog",
        url: "/blogs",
        icon: Newspaper,
        isActive: false,
      },
      {
        title: "Gallery",
        url: "/gallery",
        icon: Image,
        isActive: false,
      },
      {
        title: "Companies",
        url: "/companies",
        icon: Building2,
        isActive: false,
      },
      {
        title: "Podcasts",
        url: "/podcasts",
        icon: Radio,
        isActive: false,
      },
      {
        title: "Projects",
        url: "/projects",
        icon: Folder,
        isActive: false,
      },
      {
        title: "Service Categories",
        url: "/services/category",
        icon: Layers,
        isActive: false,
        // requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
      {
        title: "Services",
        url: "/services",
        icon: Wrench,
        isActive: false,
        // requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
      {
        title: "Job Categories",
        url: "/job-categories",
        icon: Tag,
        isActive: false,
        // requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
      {
        title: "Jobs",
        url: "/jobs",
        icon: Briefcase,
        isActive: false,
        // requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
      {
        title: "Teams",
        url: "/teams",
        icon: Users,
        isActive: false,
        // requiredPermissions: [PERMISSIONS.CATEGORYMANAGEMENT],
      },
    ],
  },
  // {
  //   label: "nav.management",
  //   items: [
  //     {
  //       title: "nav.users",
  //       url: "/admin/users",
  //       icon: Users2,
  //       isActive: true,
  //       // requiredPermissions: [PERMISSIONS.USERSMANAGEMENT],
  //     },
  //     // {
  //     //   title: "nav.user",
  //     //   url: "#",
  //     //   icon: Users2,
  //     //   requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
  //     //   items: [
  //     //     {
  //     //       title: "nav.users",
  //     //       url: "/admin/users",
  //     //       requiredPermissions: [PERMISSIONS.GET_ALL_USERS],
  //     //     },
  //     //     {
  //     //       title: "nav.create",
  //     //       url: "/admin/users/create",
  //     //       requiredPermissions: [PERMISSIONS.CREATE_USER],
  //     //     },
  //     //     // { title: "id", url: "/admin/users/:id" },
  //     //   ],
  //     // },
  //   ],
  // },
];
