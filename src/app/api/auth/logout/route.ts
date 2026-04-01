import { envVars } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    // 1. Call backend logout to invalidate session in DB
    const backendRes = await fetch(`${envVars.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json({
        success: false,
        message: "Failed to logout from server",
      }, { status: backendRes.status });
    }
  } catch (error) {
    console.error("Backend logout failed:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error during logout",
    }, { status: 500 });
  }

  // 2. Clear client-side cookies only after successful backend logout
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  
  // Also delete these if they exist with leading underscores (from proxy.ts logic)
  response.cookies.delete("__accessToken");
  response.cookies.delete("__refreshToken");

  return response;
}
