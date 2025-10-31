import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PageAnimation from "../components/animation/FramerMotion/pageAnimation";
import { Toaster } from "react-hot-toast";
import { SelectedProvider } from "../context/selectedContext";
import ReactQueryProvider from "@/context/ReactQueryProvider";

// Load Inter font
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

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
		<html lang="en">
			<body className={`${inter.variable} antialiased`}>
				<ReactQueryProvider>
					<SelectedProvider>
						<PageAnimation>
							<Toaster
								position="top-center"
								reverseOrder={false}
							/>
							{children}
						</PageAnimation>
					</SelectedProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}
