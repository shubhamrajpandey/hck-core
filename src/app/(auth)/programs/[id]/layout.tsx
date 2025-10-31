import SlideBar from "@/components/layout/ProgramWeekSlideBar/SlideBar";

export default function ProgramLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col md:flex-row z-10 gap-4 md:gap-5 overflow-hidden min-h-screen md:h-full">
			{/* Sidebar */}
			<SlideBar />

			{/* Main content */}
			{children}
		</div>
	);
}
