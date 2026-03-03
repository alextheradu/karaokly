import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - Karaokly",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 px-4">
      <article className="max-w-3xl mx-auto glass-card rounded-2xl p-8 sm:p-12 shadow-lg prose prose-invert prose-headings:text-white prose-a:text-cyan-400 hover:prose-a:text-cyan-300 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white">
        <h1 className="text-3xl font-bold border-b pb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground italic">Last Updated: February 16, 2025</p>

        <p>
          Welcome to Karaokly! Your privacy is important to us. This Privacy Policy explains how Karaokly
          (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, stores, and protects your data when
          you use{" "}
          <Link href="https://karaokly.com">https://karaokly.com</Link> (the &quot;Site&quot;).
        </p>

        <p>
          By accessing or using the Site, you agree to this Privacy Policy. If you do not agree with this
          policy, please discontinue use of our services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          Karaokly does not share your data with any third parties. However, we do collect and store certain
          user data on our secure servers to provide and improve our services.
        </p>
        <p><strong>Types of Information Collected:</strong></p>
        <ul>
          <li>
            <strong>Login Information:</strong> When you create an account, your login credentials are stored
            on our servers for authentication purposes.
          </li>
          <li>
            <strong>Playlists &amp; Preferences:</strong> Any playlists you create and preferences you set
            are securely stored on our servers to enhance your experience.
          </li>
        </ul>
        <p>We do not collect sensitive personal information, such as payment details, addresses, or phone numbers.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We collect and store your data solely for the purpose of operating and improving Karaokly:</p>
        <ul>
          <li>Allow you to log in and access your playlists across devices.</li>
          <li>Save your settings and preferences.</li>
          <li>Ensure the stability and functionality of our services.</li>
        </ul>
        <p>Your data is never sold, rented, or shared with advertisers, third-party marketers, or any other external entities.</p>

        <h2>3. Use of YouTube API Services</h2>
        <p>
          Karaokly uses YouTube API Services to provide certain features. By using our services, you agree to
          be bound by{" "}
          <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">
            YouTube&apos;s Terms of Service
          </a>
          .
        </p>
        <p>
          Additionally, you acknowledge that your data may be subject to{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google&apos;s Privacy Policy
          </a>
          .
        </p>

        <h2>4. Data Security</h2>
        <p>We prioritize the security of your data by implementing industry-standard measures, including:</p>
        <ul>
          <li><strong>Encryption:</strong> User data is encrypted both in transit and at rest.</li>
          <li><strong>Access Controls:</strong> Only authorized administrators have access to stored user data.</li>
          <li><strong>Regular Monitoring:</strong> Our servers are monitored to prevent unauthorized access.</li>
        </ul>
        <p>
          Despite these precautions, no online service can be 100% secure. By using Karaokly, you
          acknowledge and accept the inherent risks of transmitting data over the internet.
        </p>

        <h2>5. Your Data Rights</h2>
        <p>You have the following rights:</p>
        <ul>
          <li>
            <strong>Access &amp; Update:</strong> You can review and modify your stored data within your
            account settings.
          </li>
          <li>
            <strong>Account Deletion:</strong> You may request that we delete your account and associated
            data by contacting us at{" "}
            <a href="mailto:support@karaokly.com">support@karaokly.com</a>.
          </li>
          <li>
            <strong>Data Portability:</strong> If you need a copy of your stored playlists or settings, you
            may request an export from us.
          </li>
        </ul>

        <h2>6. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If changes are made, we will notify users by
          posting an updated version with a new &quot;Last Updated&quot; date at the top of this page.
        </p>

        <h2>7. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, you can contact us at:{" "}
          <a href="mailto:support@karaokly.com">support@karaokly.com</a>
        </p>
      </article>
    </div>
  )
}
