"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Plus, Users, LogOut, Edit3 } from "lucide-react";
import Image from "next/image";
import { FiUser } from "react-icons/fi";

export default function MOderatorSlideBar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
      href: "/moderatordashboard",
    },
    {
      name: "Create Resource",
      icon: <Plus size={20} />,
      href: "/moderatorcreateresource",
    },
    {
      name: "Manage Resource",
      icon: <Edit3 size={20} />,
      href: "/moderatormanageresource",
    },
    {
      name: "Student Contributions",
      icon: <Users size={20} />,
      href: "/moderatorstudentcontribution",
    },
  ];

  const handleLogout = () => {
  // Remove token and role from both localStorage and sessionStorage
  localStorage.removeItem("token");
  localStorage.removeItem("Role");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("Role");

  // Optionally, clear all storage if you want to ensure complete logout
  // localStorage.clear();
  // sessionStorage.clear();

  // Redirect to login/home page
  router.push("/");

  // Optional: reload page to reset any app state
  // window.location.reload();
};

  return (
    <aside className="fixed top-0 left-0 h-screen w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden z-30">
      <div className="border-b border-gray-200 flex gap-28">
        <div>
          <Image
            src="/imgs/HCKCORE.png"
            alt="HCK Core Logo"
            width={100}
            height={78}
            className="w-[140px] h-[100px]"
          />
        </div>
        <div className="mt-7 cursor-pointer">
          <Image
            src="/imgs/icons/collapse.svg"
            alt="HCK Core Logo"
            width={40}
            height={40}
            className="w-[30px] h-[30px]"
          />
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-3 text-[17px] font-[500] tracking-[-0.18px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.name}
              className={`flex h-[52px] items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-[#E6F4EA] text-[#28a745] border border-[#28a745]"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mb-5 border-b border-gray-200"></div>
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-[#74BF44] text-white">
              <FiUser size={22} />
            </div>
            <div>
              <p className="text-[15px] font-[500] text-gray-900">
                Bisjal Khadka
              </p>
              <p className="text-xs text-[#74BF44] font-semibold">
                Module Leader
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-[40px] w-[40px] items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
