import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/dashboard.types"
import DashboardSidebarContent from "./DashboardSidebarContent"
import { redirect } from "next/navigation"

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  // Redirect to login if user is not authenticated
  if (!userInfo) {
    redirect("/login")
  }

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role)
  const dashboardHome = getDefaultDashboardRoute(userInfo.role)

  return (
    <DashboardSidebarContent userInfo={userInfo} navItems={navItems} dashboardHome={dashboardHome} />
  )
}

export default DashboardSidebar
