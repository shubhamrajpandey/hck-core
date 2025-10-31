import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "HCKCORE | Moderator",
  description: "Moderator section for HeraldHub platform",
  icons: {
    icon: "/hck core logo.svg",
  },
};

export default function ModeratorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>
        <main className="min-h-screen px-4">{children}</main>
      </div>
    </>
  );
}
