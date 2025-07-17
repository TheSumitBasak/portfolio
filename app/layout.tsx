import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Sumit Basak - Portfolio",
  description:
    "Portfolio of Sumit Basak, a software engineer specializing in web development.",
  generator: "@TheSumitBasak",
  applicationName: "Sumit Basak Portfolio",
  keywords: [
    "Sumit Basak",
    "Portfolio",
    "Software Engineer",
    "Web Development",
    "React",
    "Next.js",
    "JavaScript",
    "TypeScript",
    "Frontend Developer",
    "Backend Developer",
    "AWS",
    "GCP",
    "Freelancer",
    "Open Source",
    "Web Applications",
    "UI/UX Design",
    "Responsive Design",
    "Full Stack Developer",
    "Software Development",
    "Web Technologies",
    "Programming",
    "Coding",
    "Web Portfolio",
    "Developer Portfolio",
    "Tech Portfolio",
    "Personal Website",
    "Web Developer",
  ],
  openGraph: {
    title: "Sumit Basak - Portfolio",
    description:
      "Portfolio of Sumit Basak, a software engineer specializing in web development.",
    url: "https://sumit-basak.vercel.app",
    siteName: "Sumit Basak Portfolio",
    images: [
      {
        url: "https://sumit-basak.vercel.app/open-graph-image.png",
        width: 1200,
        height: 630,
        alt: "Sumit Basak Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sumit Basak - Portfolio",
    description:
      "Portfolio of Sumit Basak, a software engineer specializing in web development.",
    images: ["https://sumit-basak.vercel.app/open-graph-image.png"],
    creator: "@TheSumitBasak",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
