import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy & Terms' };

export default function PolicyPage() {
  const lastUpdated = "October 31, 2024";

  return (
    <div className="site-container page-section">
      <header className="page-heading">
        <h1 className="page-title">Privacy &amp; Terms</h1>
        <p className="page-description text-sm">Last updated: {lastUpdated}</p>
      </header>
      <div className="prose max-w-none">
          <section aria-labelledby="privacy-title">
            <h2 id="privacy-title">Privacy Policy</h2>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">1. Introduction</h3>
              <p>Welcome to this website. This Privacy Policy explains how we collect, use, disclose, and protect your information when you visit our website.</p>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">2. Information We Collect</h3>
              
              <h4 className="mb-2 text-lg font-medium">2.1 Information You Provide</h4>
              <ul className="mb-4 list-disc pl-6">
                <li>Contact information (name, email address)</li>
                <li>Messages sent through contact forms</li>
                <li>Comments or feedback you submit</li>
                <li>Account information (if applicable)</li>
              </ul>

              <h4 className="mb-2 text-lg font-medium">2.2 Information Automatically Collected</h4>
              <ul className="list-disc pl-6">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Analytics data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">3. How We Use Your Information</h3>
              <ul className="list-disc pl-6">
                <li>To provide and maintain our website</li>
                <li>To respond to your inquiries</li>
                <li>To improve our services</li>
                <li>To send periodic emails (if subscribed)</li>
                <li>To monitor and analyze usage patterns</li>
              </ul>
            </section>

          </section>
          <section className="mt-12 border-t border-border pt-6" aria-labelledby="terms-title">
            <h2 id="terms-title">Terms of Service</h2>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">1. Agreement to Terms</h3>
              <p>By accessing this website, you agree to these Terms of Service and any additional terms referenced herein.</p>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">2. Intellectual Property Rights</h3>
              <ul className="list-disc pl-6">
                <li>Website content ownership</li>
                <li>Permitted uses</li>
                <li>Copyright and trademark notices</li>
                <li>User-generated content licenses</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="mb-4 text-xl font-semibold">3. User Responsibilities</h3>
              <ul className="list-disc pl-6">
                <li>Accurate information provision</li>
                <li>Account security (if applicable)</li>
                <li>Prohibited activities</li>
                <li>Content guidelines</li>
              </ul>
            </section>

          </section>
      </div>
    </div>
  );
}
