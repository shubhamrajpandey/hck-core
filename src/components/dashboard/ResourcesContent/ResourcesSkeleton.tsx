export default function ResourcesSkeleton() {
	return (
		<div className="flex flex-col p-4 sm:p-6 md:p-8 gap-4 sm:gap-6 md:gap-8 border border-gray-200 rounded-lg bg-white animate-pulse shadow-sm">
			{/* Title */}
			<div className="h-6 sm:h-8 w-3/4 bg-gray-200 rounded"></div>

			{/* Details */}
			<div className="flex flex-wrap gap-3">
				<div className="h-4 w-20 bg-gray-200 rounded"></div>
				<div className="h-6 w-16 bg-gray-300 rounded-full"></div>
				<div className="h-4 w-24 bg-gray-200 rounded"></div>
			</div>

			{/* Tags */}
			<div className="flex gap-2 flex-wrap">
				<div className="h-6 w-16 bg-gray-200 rounded"></div>
				<div className="h-6 w-20 bg-gray-200 rounded"></div>
				<div className="h-6 w-14 bg-gray-200 rounded"></div>
			</div>

			{/* Description */}
			<div className="flex flex-col gap-2">
				<div className="h-4 w-full bg-gray-200 rounded"></div>
				<div className="h-4 w-5/6 bg-gray-200 rounded"></div>
				<div className="h-4 w-3/4 bg-gray-200 rounded"></div>
			</div>

			{/* Attachments */}
			<div className="flex flex-col gap-4">
				<div className="h-4 w-24 bg-gray-300 rounded"></div>
				<div className="flex gap-2 flex-wrap">
					<div className="h-8 w-24 bg-gray-200 rounded"></div>
					<div className="h-8 w-20 bg-gray-200 rounded"></div>
					<div className="h-8 w-28 bg-gray-200 rounded"></div>
				</div>
			</div>
		</div>
	);
}
