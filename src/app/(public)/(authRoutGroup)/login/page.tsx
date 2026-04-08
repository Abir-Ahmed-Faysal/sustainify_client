import LoginForm from "@/components/module/auth/loginFrom";

// Revalidate login page every 1 hour (3600s) - auth forms are static
export const revalidate = 3600;

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginParams) {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return <LoginForm redirectPath={redirectPath} />;
}
