import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARCUS AI SOLUTIONS | Web, App & Digital Solutions",
  description: "ARCUS is a premier IT company in Guntur, Andhra Pradesh. Web development, app development, UI/UX design, branding and digital marketing for businesses across India.",
  keywords: "ARCUS, Arcus Technologies, #1 IT company Guntur, best IT company in Guntur, web development company Guntur, SEO company Guntur, digital marketing company Andhra Pradesh, app development company India, website development Guntur, software company Guntur, branding agency Guntur, UI UX design company India, ecommerce development Guntur",
  authors: [{ name: "ARCUS" }],
  other: {
    "google-site-verification": "nSgEWSELftQ2qddaya4Fm63oNZyizONjaBA5uZXuH4c",
    "geo.region": "IN-AP",
    "geo.placename": "Guntur, Andhra Pradesh, India",
    "geo.position": "16.3067;80.4365",
    "ICBM": "16.3067, 80.4365",
  },
  alternates: {
    canonical: "https://www.arcus.ai/",
  },
  openGraph: {
    type: "website",
    url: "https://www.arcus.ai/",
    siteName: "ARCUS",
    title: "ARCUS AI SOLUTIONS | Web, App & Digital Solutions",
    description: "Premier IT company in Guntur, Andhra Pradesh. Web development, app development, UI/UX design, branding and digital marketing for businesses across India.",
    images: [{ url: "https://www.arcus.ai/og-image.jpg" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCUS AI SOLUTIONS | Web, App & Digital Solutions",
    description: "Premier IT company in Guntur. Web, app, UI/UX & digital marketing across India.",
    images: ["https://www.arcus.ai/og-image.jpg"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ARCUS",
              "url": "https://www.arcus.ai/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.arcus.ai/?s={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ARCUS",
              "alternateName": ["Arcus Technologies", "Arcus Tech", "Arcus.ai"],
              "url": "https://www.arcus.ai",
              "logo": "https://www.arcus.ai/logo.png",
              "description": "ARCUS is a premier IT company in Guntur, Andhra Pradesh offering web development, app development, UI/UX design, branding and digital marketing.",
              "foundingDate": "2024",
              "founder": {
                "@type": "Person",
                "name": "Dhanush Sai Paleti",
                "jobTitle": "Founder & CEO"
              },
              "email": "paletidhanush0@gmail.com",
              "telephone": "+919398874337",
              "areaServed": ["Guntur", "Andhra Pradesh", "India"],
              "slogan": "Empowering Your Brand Through Technology and Creativity",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Door No. 3-46, Ponnekallu Village, Tadikonda Mandal",
                "addressLocality": "Guntur District",
                "addressRegion": "Andhra Pradesh",
                "postalCode": "522513",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "paletidhanush0@gmail.com",
                "telephone": "+919398874337",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi", "Telugu"],
                "areaServed": "IN"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "ARCUS",
              "url": "https://www.arcus.ai",
              "email": "paletidhanush0@gmail.com",
              "telephone": "+919398874337",
              "description": "IT company in Guntur offering web development, app development, UI/UX design, branding and digital marketing.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Door No. 3-46, Ponnekallu Village, Tadikonda Mandal",
                "addressLocality": "Guntur District",
                "addressRegion": "Andhra Pradesh",
                "postalCode": "522513",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 16.3067,
                "longitude": 80.4365
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is ARCUS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ARCUS is a premier IT company in Guntur, Andhra Pradesh offering web development, mobile app development, UI/UX design, branding and digital marketing."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Where is ARCUS located?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ARCUS is located at Door No. 3-46, Ponnekallu Village, Tadikonda Mandal, Guntur District, Andhra Pradesh, India."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How to contact ARCUS?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Email us at paletidhanush0@gmail.com or call +91 93988 74337"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased text-[#F1F5F9] bg-[#05203E]">
        {children}
      </body>
    </html>
  );
}
