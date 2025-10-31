"use client";

export function ExtraBoxSkeleton() {
	return (
		<div
			className="border border-[#002FFF4D] rounded-lg p-[clamp(1rem,2vw,1.5rem)] sm:p-[clamp(0.75rem,3vw,1rem)] bg-white w-full sm:max-w-[48%] md:max-w-[32%]
        h-auto sm:min-h-[200px] md:h-[390px] ring ring-[#00000028] animate-pulse">
			<div className="flex flex-col w-full h-full justify-between px-[clamp(1rem,2vw,1.25rem)] py-[clamp(0.75rem,1.5vw,1rem)] sm:py-[clamp(0.5rem,2vw,0.75rem)]">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="h-4 bg-gray-200 rounded w-2/3"></div>
					<div className="h-8 bg-gray-200 rounded w-20"></div>
				</div>

				{/* Title */}
				<div className="mt-4 flex items-center justify-between space-x-5">
					<div className="h-10 w-16 bg-gray-200 rounded"></div>
					<div className="h-6 bg-gray-200 rounded w-2/3"></div>
				</div>

				{/* Description */}
				<div className="mt-2 space-y-2">
					<div className="h-3 bg-gray-200 rounded w-full"></div>
					<div className="h-3 bg-gray-200 rounded w-11/12"></div>
					<div className="h-3 bg-gray-200 rounded w-10/12"></div>
					<div className="h-3 bg-gray-200 rounded w-10/12"></div>
					<div className="h-3 bg-gray-200 rounded w-10/12"></div>
				</div>

				{/* Footer */}
				<div className="mt-6 flex justify-between items-center">
					<div className="h-3 bg-gray-200 rounded w-1/3"></div>
					<div className="h-4 bg-gray-200 rounded w-16"></div>
				</div>
			</div>
		</div>
	);
}
