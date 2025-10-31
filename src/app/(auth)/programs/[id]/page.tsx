"use client";
import ResourcesContent from "@/components/dashboard/ResourcesContent/resourcesContent";
import { useEffect, useState } from "react";
import { useSelected } from "@/context/selectedContext";
import { useParams, useRouter } from "next/navigation";
import { useFetchProgramWeek } from "@/services/resources.service";
import React from "react";
import ResourcesSkeleton from "@/components/dashboard/ResourcesContent/ResourcesSkeleton";

type Resource = {
	id: number;
	title: string;
	content: string;
	createdBy: {
		id: number;
		username: string;
		role: {
			id: 0;
			name: "";
			description: "";
		};
	};
	week: {
		weekId: number;
		weekName: string;
		module: {
			id: number;
			name: string;
			code: string;
			leader: string;
			level: { id: number; name: string };
		};
	};
	files: {
		fileId: number;
		fileName: string;
		filePath: string;
	}[];
	links: {
		id: number;
		linkName: string;
		linkUrl: string;
	}[];
	createdAt: string;
};

// type FetchResponse = {
// 	data: Resource[];
// 	message: string;
// };

export default function Resources() {
	const { id } = useParams();
	const {
		selectedWeekContext,
		selectedModuleContext,
		setselectedModuleContext,
	} = useSelected();
	const router = useRouter();

	const [isChecked, setisChecked] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const resourcesPerPage = 3;

	const {
		data: weekResources,
		isLoading,
		isError,
		error,
	} = useFetchProgramWeek(selectedWeekContext, selectedModuleContext);

	useEffect(() => {
		const storedToken =
			localStorage.getItem("token") || sessionStorage.getItem("token");
		const roleSelected =
			localStorage.getItem("Role") || sessionStorage.getItem("Role");

		if (roleSelected !== "Student" || !storedToken) {
			router.push("/");
			return;
		}

		setselectedModuleContext(Number(id));
		setisChecked(true);
	}, [id, router, selectedModuleContext, setselectedModuleContext]);

	if (isLoading) {
		return (
			<div className="w-full flex flex-col px-3 sm:px-5 md:px-10 py-5 gap-6 mt-22 pt-8 overflow-y-scroll">
				{/* show 3 skeleton cards to simulate pagination batch */}
				<ResourcesSkeleton />
				<ResourcesSkeleton />
				<ResourcesSkeleton />
			</div>
		);
	}
	if (isError)
		return (
			<div className="w-full flex flex-col px-3 sm:px-5 md:px-10 py-5 gap-6 mt-22 pt-8 overflow-y-scroll">
				Error fetching resources: {String(error.message)}
			</div>
		);

	const resources =
		weekResources?.data?.filter(
			(resource: Resource) => resource.week?.weekId === selectedWeekContext
		) || [];

	const totalPages = Math.ceil(resources.length / resourcesPerPage);
	const indexOfLast = currentPage * resourcesPerPage;
	const indexOfFirst = indexOfLast - resourcesPerPage;
	const currentResources = resources.slice(indexOfFirst, indexOfLast);

	return (
		<>
			{isChecked && (
				<div className="w-full flex flex-col px-3 sm:px-5 md:px-10 py-5 gap-6 md:mt-22 pt-8 overflow-y-scroll">
					{currentResources.length > 0 ? (
						currentResources.map((week: Resource, index: number) => (
							<ResourcesContent
								key={index}
								title={week.title}
								detail={{
									submittedBy: week.createdBy.username,
									role: week.createdBy.role?.name || "Unknown",
									subject: week.week.module.name,
									level4: week.week.module.level.name,
								}}
								type={[{ values: "Frontend" }, { values: "JavaScript" }]}
								description={week.content}
								attachments={{
									documents: week.files,
									links: week.links,
								}}
							/>
						))
					) : (
						<div className="text-gray-500 text-center">No resources found.</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex flex-wrap justify-center mt-6 gap-2">
							<button
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								className="px-3 py-1.5 md:px-4 md:py-2 rounded bg-gray-200 disabled:opacity-50">
								Prev
							</button>

							{Array.from({ length: totalPages }, (_, i) => (
								<button
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-3 py-1.5 md:px-4 md:py-2 rounded ${
										currentPage === i + 1
											? "bg-green-500 text-white"
											: "bg-gray-200 hover:bg-gray-300"
									}`}>
									{i + 1}
								</button>
							))}

							<button
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages}
								className="px-3 py-1.5 md:px-4 md:py-2 rounded bg-gray-200 disabled:opacity-50">
								Next
							</button>
						</div>
					)}
				</div>
			)}
		</>
	);
}
