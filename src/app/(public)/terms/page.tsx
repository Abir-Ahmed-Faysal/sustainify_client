import React from "react";

export const metadata = {
  title: "Terms & Conditions | Sustainify",
  description: "Terms & Conditions for Sustainify - Read our service agreement",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 space-y-8">
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using the Sustainify website and services, you accept and agree
              to be bound by and comply with these Terms and Conditions. If you do not agree to
              abide by the above, please do not use this service.
            </p>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              2. Use License
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials
              (information or software) on Sustainify for personal, non-commercial transitory
              viewing only.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              This is the grant of a license, not a transfer of title, and under this license
              you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mt-3">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transmit the materials to anyone else or &quot;mirror&quot; the materials</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              3. Disclaimer
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              The materials on Sustainify are provided &quot;as is&quot;. Sustainify makes no
              warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Further, Sustainify does not warrant or make any representations concerning the
              accuracy, likely results, or reliability of the use of the materials on its
              website or otherwise relating to such materials or on any sites linked to this
              site.
            </p>
          </section>

          {/* Limitations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              4. Limitations of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              In no event shall Sustainify or its suppliers be liable for any damages
              (including, without limitation, damages for loss of data or profit, or due to
              business interruption) arising out of the use or inability to use the materials
              on Sustainify, even if Sustainify or an authorized representative has been
              notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          {/* Accuracy of Materials */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              5. Accuracy of Materials
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              The materials appearing on Sustainify could include technical, typographical, or
              photographic errors. Sustainify does not warrant that any of the materials on its
              website are accurate, complete, or current. Sustainify may make changes to the
              materials contained on its website at any time without notice.
            </p>
          </section>

          {/* Materials and Content */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              6. Materials and Content
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              As a user of Sustainify, you retain all rights to any content you submit, post or
              display on or through the website. By submitting, posting or displaying content
              you give Sustainify a worldwide, non-exclusive, royalty-free license to use,
              copy, reproduce, process, adapt, modify, publish, transmit, display and
              distribute such content in any media or medium and for any purposes.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              You agree that you will not post any abusive, obscene, vulgar, slanderous,
              hateful, threatening, sexual-oriented, or any other material that may violate any
              applicable laws.
            </p>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              7. User Conduct
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              As a user of Sustainify, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide accurate information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the website only for lawful purposes</li>
              <li>Not engage in harassment, abuse, or discriminatory behavior</li>
              <li>Respect intellectual property rights of others</li>
              <li>Not attempt to gain unauthorized access to systems</li>
            </ul>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              8. Payment Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              All transactions are processed through secure third-party payment providers. By
              making a payment, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide accurate payment information</li>
              <li>Pay all documented charges and fees</li>
              <li>Comply with all payment provider terms</li>
              <li>Accept responsibility for unauthorized use of your payment method</li>
            </ul>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              9. Refund Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Purchased access to ideas is non-refundable except as required by law. For refund
              requests or disputes, please contact our support team. All refund requests must be
              made within 30 days of purchase.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              10. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sustainify may terminate or suspend your account and access to the website
              immediately, without prior notice or liability, if you breach any of these Terms
              and Conditions. Upon termination, your right to use the website will immediately
              cease.
            </p>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              11. Links to Third-Party Websites
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sustainify has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link
              does not imply endorsement by Sustainify of the site. Use of any such linked
              website is at the user&apos;s own risk.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              12. Modifications to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Sustainify may revise these Terms and Conditions for its website at any time
              without notice. By using this website, you are agreeing to be bound by the then
              current version of these Terms and Conditions.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms and Conditions and any separate agreements we may enter into are
              governed by the laws of the jurisdiction in which the company is located.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded">
              <p className="text-gray-800 dark:text-gray-200">
                Email:{" "}
                <a
                  href="mailto:support@sustainify.com"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  support@sustainify.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
