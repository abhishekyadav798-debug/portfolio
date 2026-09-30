import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Abhishek Yadav | Freelance Software Engineer & Full-Stack Developer",
  description: "Abhishek Yadav – Freelance Software Engineer helping startups and businesses build modern websites, web applications, AI-powered solutions and scalable digital products. Based in India.",
  keywords: ["freelance software engineer", "full stack developer", "web development India", "React developer", "Node.js developer", "AI integration", "hire developer India", "Abhishek Yadav"],
  authors: [{ name: "Abhishek Yadav" }],
  creator: "Abhishek Yadav",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Abhishek Yadav – Freelance Software Engineer",
    title: "Abhishek Yadav | Freelance Software Engineer",
    description: "Building digital products that actually work. Hire a Full-Stack Developer & AI Enthusiast from India.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Abhishek Yadav Portfolio" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Yadav | Freelance Software Engineer",
    description: "Building digital products that actually work."
  },
  robots: { index: true, follow: true },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0a0a0f"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-inter bg-[#0a0a0f] text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e0e0e0',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '12px',
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } }
          }}
        />
      </body>
    </html>
  );
}
