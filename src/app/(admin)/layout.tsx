import type { Metadata } from "next";
import ClientAdminLayout from "./ClientAdminLayout";

export const metadata: Metadata = {
  title: "HCKCORE | Admin",
  description: "Moderator section for HeraldHub platform",
  icons: { icon: "/hck core logo.svg" },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientAdminLayout>{children}</ClientAdminLayout>;
}
