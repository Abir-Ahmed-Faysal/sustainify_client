import LoginForm from "@/components/module/auth/loginFrom";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginParams) {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return <LoginForm redirectPath={redirectPath} />;
}
