import RegisterForm from "@/components/module/auth/registerFrom";

// Revalidate register page every 1 hour (3600s) - auth forms are static
export const revalidate = 3600;

interface RegisterParams {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterParams) {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return <RegisterForm redirectPath={redirectPath} />;
}
