"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AppSubmitButton from "./AppSubmitButton";
import { registerAction } from "@/app/(commonLayout)/(authRoutGroup)/register/_action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppField from "@/components/shared/AppField";

import { motion } from "framer-motion";
import { toast } from "sonner";

interface RegisterFormProps {
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

const RegisterForm = ({ redirectPath }: RegisterFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) =>
      registerAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        setServerError(`Registration failed: ${error.message}`);
      }
    },
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="glass border-none shadow-xl overflow-hidden">
        <CardHeader className="text-center pb-2">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent">
              Join Sustainify
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Start your journey towards a greener future
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
                name="name"
                validators={{ onChange: registerZodSchema.shape.name }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                  />
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{ onChange: registerZodSchema.shape.email }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                  />
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{ onChange: registerZodSchema.shape.password }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
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

            {serverError && (
              <motion.div variants={itemVariants}>
                <Alert
                  variant={"destructive"}
                  className="bg-destructive/10 text-destructive border-destructive/20"
                >
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
                    isPending={isSubmitting || isPending}
                    pendingLabel="Creating Account..."
                    disabled={!canSubmit}
                    className="h-11 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all bg-emerald-600 hover:bg-emerald-700"
                  >
                    Register
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
                Or sign up with
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
              onClick={() =>
                toast.error("Google Sign-up currently unavailable")
              }
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
        </CardContent>

        <CardFooter className="justify-center py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <motion.p
            variants={itemVariants}
            className="text-sm text-slate-600 dark:text-slate-400"
          >
            Already have an account?{" "}
            <Link
              href={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 hover:underline underline-offset-4"
            >
              Log In
            </Link>
          </motion.p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
