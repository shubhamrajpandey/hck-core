import type { Metadata } from "next";
import { Header } from "../../components/layout/Header/Header";

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
		<div className="flex flex-col h-screen">
			<Header />
			{children}
		</div>
	);
}
