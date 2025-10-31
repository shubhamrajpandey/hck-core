"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	Home,
	BookOpen,
	Plus,
	Users,
	UserPlus,
	UserCog,
	LogOut,
	Edit3,
} from "lucide-react";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSlideBarProps {
	collapsed: boolean;
	setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AdminSlideBar({
	collapsed,
	setCollapsed,
}: AdminSlideBarProps) {
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	const navItems = [
		{ name: "Dashboard", icon: <Home size={20} />, href: "/dashboard" },
		{
			name: "Create & Manage Modules",
			icon: <BookOpen size={20} />,
			href: "/createmodule",
		},
		{
			name: "Create Resource",
			icon: <Plus size={20} />,
			href: "/createresource",
		},
		{
			name: "Manage Resource",
			icon: <Edit3 size={20} />,
			href: "/manageresource",
		},
		{
			name: "Student Contributions",
			icon: <Users size={20} />,
			href: "/studentcontributions",
		},
		{
			name: "Invite Moderator",
			icon: <UserPlus size={20} />,
			href: "/intivitemoderator",
		},
		{ name: "Manage Users", icon: <UserCog size={20} />, href: "/manageusers" },
	];

	// Initialize collapsed state from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem("sidebar-collapsed");
		if (stored) {
			setCollapsed(stored === "true");
		}
		setMounted(true);
	}, [setCollapsed]);

	const toggleCollapse = () => {
		setCollapsed((prev) => {
			const newState = !prev;
			localStorage.setItem("sidebar-collapsed", String(newState));
			return newState;
		});
	};

	const handleLogout = () => {
		// Save sidebar preference before clearing
		const sidebarCollapsed = localStorage.getItem("sidebar-collapsed");
		
		// Clear all user data
		localStorage.clear();
		
		// Restore sidebar preference
		if (sidebarCollapsed) {
			localStorage.setItem("sidebar-collapsed", sidebarCollapsed);
		}
		
		// Force hard refresh to clear cache
		window.location.href = "/login";
	};

	return (
		<aside
			className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden z-30 ${
				collapsed ? "w-[80px]" : "w-[320px]"
			}`}
			style={{
				transition: mounted ? "all 0.3s ease-in-out" : "none",
				opacity: mounted ? 1 : 0,
			}}>
			{/* Header */}
			<div
				className={`border-b border-gray-200 flex items-center ${
					collapsed ? "justify-center px-2" : "justify-between px-4"
				}`}>
				<AnimatePresence mode="wait">
					{!collapsed && mounted && (
						<motion.div
							key="logo"
							initial={{ opacity: 0, width: 0 }}
							animate={{ opacity: 1, width: "auto" }}
							exit={{ opacity: 0, width: 0 }}
							transition={{ duration: 0.2, ease: "easeInOut" }}>
							<Image
								src="/imgs/icons/logo.png"
								alt="HCK Core Logo"
								width={60}
								height={50}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				<div
					className="cursor-pointer py-6"
					onClick={toggleCollapse}>
					<motion.img
						src="/imgs/icons/collapse.svg"
						alt="collapse"
						width={30}
						height={30}
						className="w-[30px] h-[30px]"
						animate={{ rotate: collapsed ? 180 : 0 }}
						transition={{ duration: 0.3 }}
					/>
				</div>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-2 py-6 space-y-3 text-[17px] font-[500] tracking-[-0.18px]">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={`flex items-center ${
								collapsed ? "justify-center" : "gap-3 px-4"
							} h-[52px] rounded-lg transition-colors duration-200 ${
								isActive
									? "bg-[#E6F4EA] text-[#28a745] border border-[#28a745]"
									: "text-gray-700 hover:bg-gray-100"
							}`}>
							<div className="flex-shrink-0">{item.icon}</div>
							<AnimatePresence mode="wait">
								{!collapsed && mounted && (
									<motion.span
										key={`${item.name}-text`}
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.15, ease: "easeInOut" }}
										className="whitespace-nowrap overflow-hidden">
										{item.name}
									</motion.span>
								)}
							</AnimatePresence>
						</Link>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="mb-5 border-t border-gray-200"></div>
			<div className="px-4 pb-4">
				<div
					className={`flex items-center ${
						collapsed ? "justify-center" : "justify-between"
					} mt-4`}>
					<AnimatePresence mode="wait">
						{!collapsed && mounted && (
							<motion.div
								key="user-info"
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: "auto" }}
								exit={{ opacity: 0, width: 0 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								className="flex items-center gap-3">
								<div className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-[#74BF44] text-white">
									<FiUser size={22} />
								</div>
								<div>
									<p className="text-[15px] font-[500] text-gray-900">Admin</p>
									<p className="text-xs text-[#74BF44] font-semibold">
										Herald College Kathmandu
									</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<button
						onClick={handleLogout}
						className="group relative flex h-[40px] w-[40px] items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer">
						<LogOut size={20} />
						<span
							className="absolute left-1/2 -translate-x-1/2  
                   px-2 mb-16 text-xs text-[#74BF44] bg-[#E6F4EA] rounded-sm 
                   opacity-0 group-hover:opacity-100 transition-opacity">
							Logout
						</span>
					</button>
				</div>
			</div>
		</aside>
	);
}