import { ChevronDown, Search, MessageSquare, AlertCircle, Lock, CreditCard, Eye, Zap, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Revalidate help page every 24 hours (86400s) - mostly static content
export const revalidate = 86400;

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const faqItems: FAQItem[] = [
  // Getting Started
  {
    id: "1",
    category: "Getting Started",
    question: "What is Sustainify?",
    answer: "Sustainify is a community platform dedicated to discovering, sharing, and monetizing innovative sustainability solutions. We connect changemakers, innovators, and organizations to create real, measurable impact on our planet. Our platform allows you to browse ideas, contribute your own, and support solutions that align with your values.",
    icon: <Globe className="w-5 h-5" />,
  },
  {
    id: "2",
    category: "Getting Started",
    question: "How do I create an account?",
    answer: "Click the 'Sign Up' button in the top navigation bar. Fill in your email address and create a strong password. You'll receive a verification email - confirm it to activate your account. You can also sign up using your Google account for faster registration.",
    icon: <Users className="w-5 h-5" />,
  },
  {
    id: "3",
    category: "Getting Started",
    question: "Is it free to join Sustainify?",
    answer: "Yes! Creating an account and browsing ideas on Sustainify is completely free. You can vote, comment, and favorite ideas without any cost. Some ideas may have associated monetization options, but participation in the community is always free.",
    icon: <Zap className="w-5 h-5" />,
  },

  // Ideas & Content
  {
    id: "4",
    category: "Ideas & Content",
    question: "How do I submit a new idea?",
    answer: "Log in to your account and click the 'Create Idea' button. Fill in the required fields: title, problem statement, description, category, and upload an image. Your idea will be submitted for review. Once approved by our team, it will be visible to the community.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "5",
    category: "Ideas & Content",
    question: "What happens after I submit an idea?",
    answer: "Your idea goes through our review process. The Sustainify team reviews it for quality, relevance, and compliance with our guidelines. You'll receive an email notification once your idea is approved, rejected, or needs changes. Approved ideas appear immediately in the community.",
    icon: <Eye className="w-5 h-5" />,
  },
  {
    id: "6",
    category: "Ideas & Content",
    question: "Can I edit my idea after submitting it?",
    answer: "Yes! You can edit your idea after submission. Go to the idea detail page and click 'Edit' in the options menu. If your idea is already approved, changes will go through a quick review process before being published. You cannot edit rejected ideas, but you can create a new version.",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    id: "7",
    category: "Ideas & Content",
    question: "How do I search for specific ideas?",
    answer: "Use the search bar at the top of the page or in the hero section. You can search by idea title, keywords, or explore by category. Filter results by status, category, or sorting preference. The AI-powered search ranks results by relevance and community engagement.",
    icon: <Search className="w-5 h-5" />,
  },

  // Community Engagement
  {
    id: "8",
    category: "Community Engagement",
    question: "What do upvotes and downvotes mean?",
    answer: "Upvotes show your support for an idea's viability and impact. Downvotes indicate concerns about feasibility or relevance. The vote score (upvotes minus downvotes) helps the community identify the most promising ideas. Your votes are private and help personalize your experience.",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "9",
    category: "Community Engagement",
    question: "Can I comment on ideas?",
    answer: "Yes! You can comment on any approved idea to provide feedback, ask questions, or offer support. Comments help creators refine their ideas and foster community discussion. Be respectful and constructive in your comments - negative comments may be flagged.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "10",
    category: "Community Engagement",
    question: "How do I favorite an idea?",
    answer: "Click the heart icon on any idea card or detail page to add it to your favorites. Your favorite ideas will be saved in your profile under 'My Favorites' for quick access later. Favoriting helps us provide personalized recommendations.",
    icon: <Users className="w-5 h-5" />,
  },

  // Monetization
  {
    id: "11",
    category: "Monetization",
    question: "What does 'Paid' mean on ideas?",
    answer: "Some ideas are marked as 'Paid' ideas, which means the creator is offering specific solutions or implementations for a fee. This doesn't affect free browsing - you can view all idea details without payment. Payment is optional and only required if you want to engage with premium services.",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "12",
    category: "Monetization",
    question: "How can I monetize my idea?",
    answer: "Once your idea is approved and gains community traction, you can apply for our monetization program. This allows you to offer consulting, implementation services, or premium access. Contact us at support@sustainify.com or visit your idea dashboard to learn more about monetization options.",
    icon: <Zap className="w-5 h-5" />,
  },

  // Privacy & Security
  {
    id: "13",
    category: "Privacy & Security",
    question: "How is my personal data protected?",
    answer: "We take privacy seriously. Your data is encrypted and stored securely on our servers. We comply with GDPR and other international privacy standards. We never share your personal information with third parties without your consent. Review our Privacy Policy for detailed information.",
    icon: <Lock className="w-5 h-5" />,
  },
  {
    id: "14",
    category: "Privacy & Security",
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account anytime. Go to your profile settings and select 'Delete Account'. This will remove all your personal information and data. Note: ideas you've contributed will remain on the platform but won't be associated with your account.",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    id: "15",
    category: "Privacy & Security",
    question: "What is the color theme feature?",
    answer: "Sustainify supports light and dark color modes to suit your preference. Click the sun/moon icon in the navigation bar to toggle between themes. Your preference is saved to your profile and will be remembered on all your future visits.",
    icon: <Eye className="w-5 h-5" />,
  },

  // Technical
  {
    id: "16",
    category: "Technical Issues",
    question: "What browsers are supported?",
    answer: "Sustainify works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience. Mobile browsers are fully supported as well.",
    icon: <AlertCircle className="w-5 h-5" />,
  },
  {
    id: "17",
    category: "Technical Issues",
    question: "Why am I getting an error message?",
    answer: "Error messages usually indicate a temporary issue. First, try refreshing the page. If the problem persists, clear your browser cache and cookies. If you continue experiencing issues with a specific feature, contact support at support@sustainify.com with details about the error.",
    icon: <AlertCircle className="w-5 h-5" />,
  },

  // Contact & Support
  {
    id: "18",
    category: "Contact & Support",
    question: "How do I contact customer support?",
    answer: "You can reach our support team through multiple channels: Email us at support@sustainify.com, fill out the contact form at /contact, or check this help page for answers to common questions. We typically respond within 24-48 hours.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    id: "19",
    category: "Contact & Support",
    question: "How do I report inappropriate content?",
    answer: "If you encounter ideas, comments, or profiles that violate our community guidelines, click the three-dot menu on the item and select 'Report'. Provide details about the violation. Our team reviews all reports and takes appropriate action to maintain a safe community.",
    icon: <AlertCircle className="w-5 h-5" />,
  },
];

const categories = [...new Set(faqItems.map(item => item.category))];

export default function HelpPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20">
          <div className="max-w-4xl">
            <Badge variant="outline" className="mb-6 border-blue-500/50 text-blue-400">Help & Support</Badge>
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
              How Can We <span className="text-blue-400">Help You?</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Find answers to common questions about Sustainify, from getting started to monetizing your ideas. Don't see your answer? Contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-950/50">
                <Link href="/ideas">Browse Ideas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {categories.map((category) => {
              const categoryItems = faqItems.filter(item => item.category === category);
              
              return (
                <div key={category} className="mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 pb-4 border-b-2 border-blue-500/20">
                    {category}
                  </h2>

                  <div className="space-y-4">
                    {categoryItems.map((item) => (
                      <details
                        key={item.id}
                        className="group bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 cursor-pointer hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors"
                      >
                        <summary className="flex items-start gap-4 list-none">
                          <div className="text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
                              {item.question}
                            </h3>
                          </div>
                          <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform flex-shrink-0 mt-1" />
                        </summary>
                        
                        <div className="ml-9 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Didn't find your answer?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Contact us directly and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact">Send Message</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <a href="mailto:support@sustainify.com">Email Support</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
