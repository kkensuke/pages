import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { FEATURES } from "@/config/constants";
import Header from "./header";
import Footer from "./footer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { Metadata } from "next";
import { SITE_CONFIG } from "@/config/site";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Next.js',
    'TypeScript',
    'Blog',
    'Programming',
    'Tutorial',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ja_JP'],
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <head />
      <body>
        <ErrorBoundary>
          <Header />
          <div className="min-h-[93vh] px-2">
            {children}
          </div>
          <Footer />
          {FEATURES.ENABLE_ANALYTICS && <Analytics />}
          <script
            data-name="BMC-Widget"
            data-cfasync="false"
            src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
            data-id="kkensuke"
            data-description="Support me on Buy me a coffee!"
            data-message=""
            data-color="#40DCA5"
            data-position="Right"
            data-x_margin="18"
            data-y_margin="18"
          ></script>
        </ErrorBoundary>
      </body>
    </html>
  );
}
