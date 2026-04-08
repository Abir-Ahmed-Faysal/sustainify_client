"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AppField from "@/components/shared/AppField";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { submitContactMessage } from "@/services/contact.service";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must not exceed 200 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters")
    .trim(),
});

type ContactFormData = z.infer<typeof contactSchema>;

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

export default function ContactForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: submitContactMessage,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      try {
        // Validate with Zod
        const validatedData = contactSchema.parse(value);

        const result = await mutateAsync(validatedData);

        if (!result.success) {
          setServerError(result.message || "Failed to send message");
          toast.error(result.message || "Failed to send message");
          return;
        }

        // Success
        setSuccessMessage(
          "Thank you for reaching out! We'll get back to you soon."
        );
        toast.success("Message sent successfully!");

        // Reset form
        form.reset();

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (error: any) {
        const errorMsg = 
          error.response?.data?.message || 
          error.message || 
          "Failed to send message. Please try again.";
        setServerError(errorMsg);
        toast.error(errorMsg);
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
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <Mail className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent">
              Get In Touch
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Have a question or feedback? We `&apos;`d love to hear from you. Send us a message and we `&apos;`ll respond as soon as possible.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {successMessage && (
            <motion.div variants={itemVariants}>
              <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                  {successMessage}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {serverError && (
            <motion.div variants={itemVariants}>
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {serverError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <form.Field
                name="name"
                validators={{
                  onBlur: async (value) => {
                    try {
                      z.string()
                        .min(1, "Name is required")
                        .max(100, "Name too long")
                        .parse(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Your Name"
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                )}
              </form.Field>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <form.Field
                name="email"
                validators={{
                  onBlur: async (value) => {
                    try {
                      z.string()
                        .email("Invalid email address")
                        .parse(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isPending}
                  />
                )}
              </form.Field>
            </motion.div>

            {/* Subject Field */}
            <motion.div variants={itemVariants}>
              <form.Field
                name="subject"
                validators={{
                  onBlur: async (value) => {
                    try {
                      z.string()
                        .min(1, "Subject is required")
                        .max(200, "Subject too long")
                        .parse(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
              >
                {(field) => (
                  <AppField
                    field={field}
                    label="Subject"
                    placeholder="How can we help?"
                    disabled={isPending}
                  />
                )}
              </form.Field>
            </motion.div>

            {/* Message Field */}
            <motion.div variants={itemVariants}>
              <form.Field
                name="message"
                validators={{
                  onBlur: async (value) => {
                    try {
                      z.string()
                        .min(10, "Message must be at least 10 characters")
                        .max(5000, "Message too long")
                        .parse(value);
                    } catch (error: any) {
                      return error.message;
                    }
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Message
                    </label>
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Tell us what's on your mind..."
                      disabled={isPending}
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 transition-all resize-none"
                    />
                    {field.state.meta.errors[0] && (
                      <p className="text-sm text-red-500">
                        {field.state.meta.errors[0]}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
