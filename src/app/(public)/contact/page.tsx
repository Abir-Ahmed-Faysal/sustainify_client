import ContactForm from "@/components/module/contact/ContactForm";
import { motion } from "framer-motion";

export const metadata = {
  title: "Contact Us | Sustainify",
  description:
    "Get in touch with Sustainify. Have questions or feedback? We'd love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-4">
              We&apos;re Here to Help
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Have a question about Sustainify? Want to share an idea or provide
              feedback? Reach out to our team and we&apos;ll get back to you as
              soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <div className="mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Card */}
            <div className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Email
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                support@sustainify.com
              </p>
            </div>

            {/* Response Time Card */}
            <div className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Response Time
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We respond within 24-48 hours
              </p>
            </div>

            {/* Available Card */}
            <div className="text-center">
              <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <svg
                  className="h-6 w-6 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Always Available
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Submit your message anytime, anywhere
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
