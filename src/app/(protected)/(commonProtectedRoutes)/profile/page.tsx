import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileContent from "@/components/profile/ProfileContent"
import ProfileStats from "@/components/profile/ProfileStats"
import ProfileIdeas from "@/components/profile/ProfileIdeas"
import { getStats } from "@/services/stats.service"
import { getMyIdeas } from "@/services/idea.service"
import { IMemberStats } from "@/types/stats.types"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My Profile | Sustainify",
  description: "Manage your profile and account information",
}

export default async function ProfilePage() {
  try {
    // Get the access token from cookies (server-side)
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    const refreshToken = cookieStore.get("refreshToken")?.value

    if (!accessToken) {
      redirect("/login")
    }

    // Fetch profile data server-side
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const cookieParts: string[] = [];
    if (accessToken) cookieParts.push(`accessToken=${accessToken}`);
    if (refreshToken) cookieParts.push(`refreshToken=${refreshToken}`);

    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieParts.join("; "),
      },
    })

    if (!response.ok) {
      redirect("/login")
    }

    const { data: userProfile } = await response.json()

    // Fetch stats and my ideas in parallel
    const [statsResponse, ideasResponse] = await Promise.all([
      getStats(),
      getMyIdeas()
    ])

    const stats = statsResponse?.data as IMemberStats | null
    const ideas = ideasResponse?.data || []

    return (
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        <ProfileContent initialProfile={userProfile} />
        
        {stats && userProfile.role === "MEMBER" && (
          <div className="max-w-2xl mx-auto mt-8 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">My Activity</h2>
            <ProfileStats stats={stats} />
            <ProfileIdeas ideas={ideas} />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error loading profile:", error)
    redirect("/login")
  }
}