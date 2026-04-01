import RegisterForm from "@/components/module/auth/registerFrom";

interface RegisterParams {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterParams) {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return <RegisterForm redirectPath={redirectPath} />;
}
