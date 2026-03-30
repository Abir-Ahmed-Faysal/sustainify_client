import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home"
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard"
                },
                {
                    title: "My Profile",
                    href: "/profile",
                    icon: "User"
                },
            ]
        }
    ];
};

export const memberNavItems: NavSection[] = [
    {
        title: "Ideas",
        items: [
            {
                title: "My Ideas",
                href: "/dashboard/my-ideas",
                icon: "Lightbulb"
            },
            {
                title: "Create Idea",
                href: "/dashboard/create-idea",
                icon: "Plus"
            },
            {
                title: "Browse Ideas",
                href: "/dashboard/browse-ideas",
                icon: "Search"
            },
        ]
    },
    {
        title: "Community",
        items: [
            {
                title: "Voting Activity",
                href: "/dashboard/voting-activity",
                icon: "ThumbsUp"
            },
            {
                title: "Categories",
                href: "/dashboard/categories",
                icon: "Layers"
            },
        ]
    }
];

export const adminNavItems: NavSection[] = [
    {
        title: "Idea Management",
        items: [
            {
                title: "Manage Ideas",
                href: "/admin/dashboard/ideas",
                icon: "FileText"
            }
        ]
    },
    {
        title: "User Management",
        items: [
            {
                title: "Members",
                href: "/admin/dashboard/members",
                icon: "Users"
            }
        ]
    }
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...adminNavItems];

        case "MEMBER":
            return [...commonNavItems, ...memberNavItems];

        default:
            return commonNavItems;
    }
};