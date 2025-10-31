function SkeletonBox({ className }: { className?: string }) {
	return (
		<div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>
	);
}

export default function ProfileLoading() {
	return (
		<div className="flex flex-col items-center min-h-screen w-full bg-[#F8F8F8] px-4 sm:px-6 lg:px-8 mt-[90px]">
			{/* Header */}
			<div className="mt-20 w-full text-center flex flex-col items-center">
				<SkeletonBox className="h-8 w-40 mb-4" />
				<SkeletonBox className="h-5 w-64" />
			</div>

			{/* Activity Summary */}
			<div className="mt-12 w-full max-w-4xl bg-white rounded-md shadow-md p-6 sm:p-10">
				<SkeletonBox className="h-6 w-40 mb-8" />
				<div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-0">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex flex-col items-center gap-3 flex-1">
							<SkeletonBox className="w-14 h-14 rounded-lg" />
							<SkeletonBox className="h-8 w-10" />
							<SkeletonBox className="h-5 w-28" />
						</div>
					))}
				</div>
			</div>

			{/* Account Information */}
			<div className="mt-10 w-full max-w-4xl bg-white rounded-md shadow-md p-6 sm:p-10">
				<SkeletonBox className="h-6 w-44 mb-8" />
				<div className="space-y-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="flex gap-3 items-center">
							<SkeletonBox className="w-10 h-10 rounded-lg" />
							<div className="flex flex-col gap-2">
								<SkeletonBox className="h-4 w-16" />
								<SkeletonBox className="h-5 w-32" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
