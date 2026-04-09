"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";

import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AppSubmitButton from "./AppSubmitButton";
import { loginAction } from "@/app/(public)/(authRoutGroup)/login/_action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppField from "@/components/shared/AppField";
import { toast } from "sonner";

import { motion } from "framer-motion";

interface LoginFormProps {
  redirectPath?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
        // If no error returned, redirect is happening - show loading state
        setRedirecting(true);
      } catch (error: any) {
        // Ignore Next.js redirect errors - they're expected and not real errors
        if (error?.message === "NEXT_REDIRECT" || error?.digest?.startsWith("NEXT_REDIRECT")) {
          setRedirecting(true);
          return;
        }
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full relative"
    >
      <Card className="glass border-none shadow-xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Log in to continue your sustainable journey
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            method="POST"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <form.Field
                name="email"
                validators={{ onChange: loginZodSchema.shape.email }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    disabled={redirecting}
                  />
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{ onChange: loginZodSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={redirecting}
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                        disabled={redirecting}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4 text-slate-500" />
                        ) : (
                          <Eye className="size-4 text-slate-500" />
                        )}
                      </Button>
                    }
                  />
                )}
              </form.Field>
            </motion.div>

            {serverError && !redirecting && (
              <motion.div variants={itemVariants}>
                <Alert variant={"destructive"} className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="pt-2">
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting] as const}
              >
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending || redirecting}
                    pendingLabel={redirecting ? "Redirecting..." : "Authenticating..."}
                    disabled={!canSubmit || redirecting}
                    className="h-11 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700"
                  >
                    Log In
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-transparent backdrop-blur-sm text-slate-500 font-medium tracking-wider">
                Or secure login with
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
              onClick={() => toast.error('Google Sign-in currently unavailable')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google Account
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="button"
              variant="secondary"
              className="w-full h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
              onClick={() => {
                form.setFieldValue('email', 'demo@sustainify.com');
                form.setFieldValue('password', 'Demo@1234');
                toast.success('Demo credentials filled. Click Log In to continue.');
              }}
              disabled={redirecting}
            >
              Try Demo Account
            </Button>
          </motion.div>
        </CardContent>

        <CardFooter className="justify-center py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <motion.p variants={itemVariants} className="text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 hover:underline underline-offset-4"
            >
              Sign up today
            </Link>
          </motion.p>
        </CardFooter>
      </Card>

      {/* Loading overlay during redirect */}
      {redirecting && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-emerald-200/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm font-medium text-white">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LoginForm;
