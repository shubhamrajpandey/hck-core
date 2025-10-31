import type { Metadata } from "next";
import ModeratorSlideBar from "../../components/layout/ModeratorSlidebar/ModeratorSlidebar";

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
    <div className="flex">
      <ModeratorSlideBar />
      <main className="flex-1 min-h-screen px-4 ml-90 relative">
        {children}
      </main>
    </div>
  );
}
