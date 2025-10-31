import type { Metadata } from "next";
import Footer from "../../components/layout/Footer/Footer";
import { Header } from "../../components/layout/Header/Header";

export const metadata: Metadata = {
  title: "HCKCORE",
  description: "Student registration for HeraldHub platform",
  icons: {
    icon: "/hck core logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow mt-[90px]">{children}</main>
      <Footer />
    </div>
  );
}
