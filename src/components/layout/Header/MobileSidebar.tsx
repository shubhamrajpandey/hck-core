"use client";

import {
	Sheet,
	SheetContent,
	SheetClose,
	SheetHeader,

} from "@/components/ui/sheet";
import { FiUser, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@/lib/useMediaQuery";
import { useEffect } from "react";
import Image from "next/image";

type MobileSidebarProps = {
	isLoggedIn: boolean;
	handleLogout: () => void;
	menuOpen?: boolean;
	setMenuOpen?: (open: boolean) => void;
};

export default function MobileSidebar({
	isLoggedIn,
	handleLogout,
	menuOpen = false,
	setMenuOpen = () => {},
}: MobileSidebarProps) {
	const pathname = usePathname();
	const router = useRouter();
	const isLgOrUp = useMediaQuery("(min-width: 1024px)");

	useEffect(() => {
		if (isLgOrUp && menuOpen) setMenuOpen(false);
	}, [isLgOrUp, menuOpen, setMenuOpen]);

	if (isLgOrUp) return null;

	const NavItem = ({
		label,
		href,
	}: {
		label: string;
		href: string;
	}) => (
		<span
			className={`cursor-pointer block text-[16px] font-medium ${
				pathname === href ? "text-[#74BF44]" : "text-black hover:text-[#74BF44]"
			}`}
			onClick={() => {
				router.push(href);
				setMenuOpen(false);
			}}>
			{label}
		</span>
	);

	return (
		<Sheet open={menuOpen} onOpenChange={setMenuOpen}>
			<SheetContent
				side="right"
				className="lg:hidden w-64 p-6 flex flex-col justify-start gap-6 bg-white border-none shadow-lg">
				{/* Header with logo */}
				<SheetHeader className="mb-3 ml-[-20px]">
					<Image
						src="/imgs/icons/DevCorps_Development_Platform-15.png" 
						alt="Development Platform Logo"
						width={140}
						height={140}
						className="rounded-md "
					/>
				</SheetHeader>

				{/* Navigation Links */}
				<div className="flex flex-col gap-4 ">
					{isLoggedIn ? (
						<>
							<NavItem label="Home" href="/programs" />
							<NavItem label="Extra Learning" href="/extra-resources" />
							<NavItem label="Submit Resources" href="/contributions" />

							{/* Profile & Logout */}
							<div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
								<span
									onClick={() => {
										router.push("/profile");
										setMenuOpen(false);
									}}
									className="flex items-center gap-2 cursor-pointer hover:text-[#74BF44] text-[15px] font-medium">
									<FiUser size={18} /> Profile Dashboard
								</span>
								<span
									onClick={() => {
										handleLogout();
										setMenuOpen(false);
									}}
									className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 text-[15px] font-medium">
									<FiLogOut size={18} /> Logout
								</span>
							</div>
						</>
					) : (
						<Link href="/login" passHref>
							<SheetClose asChild>
								<button className="bg-[#74BF44] text-white w-full h-[42px] rounded-[8px] cursor-pointer text-[16px] font-semibold hover:bg-white hover:text-[#74BF44] border border-[#74BF44] transition">
									Login
								</button>
							</SheetClose>
						</Link>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
