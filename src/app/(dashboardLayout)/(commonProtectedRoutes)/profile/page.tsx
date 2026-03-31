import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProfileContent from "@/components/profile/ProfileContent"

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

    // Fetch profile data server-side using node fetch
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    const response = await fetch(`${baseUrl}/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": `accessToken=${accessToken};refreshToken=${refreshToken}`,
      },
    })

    if (!response.ok) {
      redirect("/login")
    }

    const { data: userProfile } = await response.json()

    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <ProfileContent initialProfile={userProfile} />
      </div>
    )
  } catch (error) {
    console.error("Error loading profile:", error)
    redirect("/login")
  }
}
