import Link from "next/link"

export const metadata = {
  title: "Terms of Service - Karaokly",
}

export default function TosPage() {
  return (
    <div className="min-h-screen bg-dark-noise py-12 px-4">
      <article className="max-w-3xl mx-auto glass-card rounded-2xl p-8 sm:p-12 shadow-lg prose prose-invert prose-headings:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white">
        <h1 className="text-3xl font-bold border-b pb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground italic">Last Updated: February 16, 2025</p>

        <p>
          Welcome to Karaokly! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
          Karaokly website located at{" "}
          <Link href="https://karaokly.com">https://karaokly.com</Link> (the &quot;Site&quot;) and all
          related services provided by Karaokly (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). By
          accessing or using the Site, you agree to be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using our Site, you confirm that you have read, understood, and agree to be bound by these
          Terms, including any future modifications. Your continued use of the Site constitutes your
          acceptance of any changes.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Site. By using the Site, you represent and warrant
          that you meet the age requirements and that you have the legal capacity to enter into these Terms.
        </p>

        <h2>3. Description of Services</h2>
        <p>
          Karaokly is a karaoke platform that provides access to karaoke songs, lyrics, and related
          features. We reserve the right to modify, suspend, or discontinue any aspect of the Site at any
          time without prior notice.
        </p>

        <h2>4. Account Registration</h2>
        <ul>
          <li>
            <strong>Account Creation:</strong> To access certain features, you may be required to create an
            account. When you register, you agree to provide accurate and complete information.
          </li>
          <li>
            <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of
            your account credentials and for all activities that occur under your account.
          </li>
        </ul>

        <h2>5. User Conduct</h2>
        <p>
          You agree to use the Site only for lawful purposes and in a manner that does not infringe the
          rights of others. Prohibited conduct includes:
        </p>
        <ul>
          <li>Uploading or posting content that is defamatory, obscene, or otherwise objectionable.</li>
          <li>Engaging in harassment, hate speech, or any illegal activity.</li>
          <li>Interfering with or disrupting the operation of the Site.</li>
        </ul>

        <h2>6. User Content</h2>
        <p>
          If you submit content on or through the Site (&quot;User Content&quot;), you grant Karaokly a
          worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, display, and
          perform such User Content in connection with the Site.
        </p>

        <h2>7. Management of User Accounts and Content</h2>
        <ul>
          <li>
            <strong>Account Termination:</strong> We reserve the right to suspend or terminate your account
            at our sole discretion, without prior notice.
          </li>
          <li>
            <strong>Modification of Playlists:</strong> We reserve the right to modify, edit, or delete any
            user-generated playlists or content that violate these Terms.
          </li>
        </ul>

        <h2>8. Intellectual Property</h2>
        <p>
          All content on the Site is the property of Karaokly or its licensors and is protected by copyright
          and other intellectual property laws. You agree not to reproduce, distribute, modify, or create
          derivative works without our express written permission.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          The Site and all content and services are offered on an &quot;as is&quot; and &quot;as
          available&quot; basis without any warranties of any kind. Your use of the Site is at your own risk.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Karaokly shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of or in connection with your use of the
          Site.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Karaokly, its officers, directors, employees, and agents
          from any claims, damages, liabilities, or expenses arising out of your use of the Site.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of
          California. Any legal action shall be brought exclusively in the courts located in California.
        </p>

        <h2>13. Dispute Resolution</h2>
        <p>
          Any dispute arising out of or relating to these Terms shall be resolved through binding arbitration
          in accordance with the rules of JAMS, and you hereby waive your right to a trial by jury or to
          participate in a class action.
        </p>

        <h2>14. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Any changes will be posted on this page with an
          updated effective date.
        </p>

        <h2>15. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:{" "}
          <a href="mailto:support@karaokly.com">support@karaokly.com</a>
        </p>
      </article>
    </div>
  )
}
