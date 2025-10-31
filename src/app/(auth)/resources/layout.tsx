import ResponsiveWeekSelector from "@/components/layout/Responsiveweekcontent/responsiveweekcontent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HCKCORE",
  description: "Moderator section for HeraldHub platform",
  icons: {
    icon: "/hck core logo.svg",
  },
};

export default function ResourcesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ResponsiveWeekSelector>{children}</ResponsiveWeekSelector>;
}
