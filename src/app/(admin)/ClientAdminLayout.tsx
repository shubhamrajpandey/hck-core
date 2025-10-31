"use client";

import { useEffect, useState } from "react";
import AdminSlideBar from "../../components/layout/AdminSliderbar/page";

export default function ClientAdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  return (
    <div className="flex">
      <AdminSlideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`flex-1 min-h-screen px-4 relative transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-80"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
