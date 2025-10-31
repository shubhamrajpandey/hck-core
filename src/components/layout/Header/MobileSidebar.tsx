"use client";

import {
	Sheet,
	SheetContent,
	SheetClose,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { FiUser, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@/lib/useMediaQuery";
import { useEffect } from "react";

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
		if (isLgOrUp && menuOpen) {
			setMenuOpen(false);
		}
	}, [isLgOrUp, menuOpen, setMenuOpen]);

	if (isLgOrUp) return null;

	return (
		<Sheet
			open={menuOpen}
			onOpenChange={setMenuOpen}>
			<SheetContent
				side="right"
				className="lg:hidden w-64 p-6 flex flex-col justify-start gap-6 bg-white border-none">
				<SheetHeader>
					<SheetTitle></SheetTitle>
					<SheetDescription></SheetDescription>
				</SheetHeader>
				{isLoggedIn ? (
					<>
						<span
							className={`cursor-pointer ${
								pathname === "/programs" ? "text-[#74BF44]" : "text-black"
							}`}
							onClick={() => {
								router.push("/programs");
								setMenuOpen(false);
							}}>
							Home
						</span>
						<span
							className={`cursor-pointer ${
								pathname === "/extra-resources"
									? "text-[#74BF44]"
									: "text-black"
							}`}
							onClick={() => {
								router.push("/extra-resources");
								setMenuOpen(false);
							}}>
							Extra Learning
						</span>
						<span
							className={`cursor-pointer ${
								pathname === "/contributions" ? "text-[#74BF44]" : "text-black"
							}`}
							onClick={() => {
								router.push("/contributions");
								setMenuOpen(false);
							}}>
							Submit Resources
						</span>

						{/* Profile & Logout */}
						<div className="border-t pt-4 flex flex-col gap-3">
							<span
								onClick={() => {
									router.push("/profile");
									setMenuOpen(false);
								}}
								className="flex items-center gap-2 cursor-pointer hover:text-[#74BF44]">
								<FiUser /> Profile Dashboard
							</span>
							<span
								onClick={() => {
									handleLogout();
									setMenuOpen(false);
								}}
								className="flex items-center gap-2 cursor-pointer text-red-600">
								<FiLogOut /> Logout
							</span>
						</div>
					</>
				) : (
					<Link
						href="/login"
						passHref>
						<SheetClose asChild>
							<button className="bg-[#74BF44] text-white w-full h-[40px] rounded-[7px] cursor-pointer text-[16px] font-semibold hover:bg-white hover:text-[#74BF44] transition">
								Login
							</button>
						</SheetClose>
					</Link>
				)}
			</SheetContent>
		</Sheet>
	);
}
