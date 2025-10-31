"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
// import ContributorDrop from "@/components/dropdown/ContributorDrop";
import ProgramDrop from "@/components/dropdown/ProgramDrop";
import ExtraBox from "@/components/dashboard/ExtraBox/extraBox";
import {
	useFetchExtraResources,
	useFetchExtraResourcesByCategories,
} from "@/services/resources.service";
import { ExtraBoxSkeleton } from "@/components/dashboard/ExtraBox/ExtraBoxSkeleton";
import { useSelected } from "@/context/selectedContext";

export type ExtraResource = {
	id: number;
	title: string;
	description: string;
	keywords: string[];
	link: string;
	uploadedById: number;
	categoryId: number;
	category: {
		categoryId: number;
		categoryName: string;
	};
	files: {
		Id: number;
		extraResourceId: number;
		requestId: number | null;
		fileName: string;
		filePath: string;
	}[];
};

export default function ExtraPage() {
	// const [showFilter, setShowFilter] = useState(false);
	// const [resources, setResources] = useState<ExtraResource[]>([]);
	// const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	// const resourcesPerPage = 6;
	const router = useRouter();
	const [isChecked, setIsChecked] = useState(false);
	const { selectedCategory } = useSelected();

	const {
		data: extraResources,
		isLoading: isExtraResourceLoading,
		isError: isExtraResourceError,
		error: extraResourceError,
	} = useFetchExtraResources({
		page: currentPage,
		limit: 10,
	});

	const {
		data: extraResourcesByCategories,
		isLoading: isExtraResourcesByCategoriesLoading,
		isError: isExtraResourcesByCategoriesError,
		error: extraResourcesByCategoriesError,
	} = useFetchExtraResourcesByCategories({
		page: currentPage,
		limit: 10,
		categoryId: selectedCategory,
	});

	const isError = selectedCategory
		? isExtraResourcesByCategoriesError
		: isExtraResourceError;
	const isLoading = selectedCategory
		? isExtraResourcesByCategoriesLoading
		: isExtraResourceLoading;
	const error = selectedCategory
		? extraResourcesByCategoriesError
		: extraResourceError;
	const data = selectedCategory ? extraResourcesByCategories : extraResources;

	const currentResources = selectedCategory
		? extraResourcesByCategories?.resources || []
		: extraResources?.resources || [];

	useEffect(() => {
		const fetchResources = async () => {
			try {
				// setLoading(true);
				const token =
					localStorage.getItem("token") || sessionStorage.getItem("token");
				const RoleSelected =
					localStorage.getItem("Role") || sessionStorage.getItem("Role");
				if (RoleSelected !== "Student" || !token) {
					router.push("/");
				}
				setIsChecked(true);

				// const res = await fetch(
				// 	"https://herald-hub-backend.onrender.com/extra-resources",
				// 	{
				// 		headers: { Authorization: `Bearer ${token}` },
				// 	}
				// );

				// const data = await res.json();
				// if (data?.data?.resources) {
				// 	setResources(data.data.resources);
				// } else {
				// 	setResources([]);
				// }
			} catch (error) {
				console.error("Error fetching resources:", error);
				// setResources([]);
			} finally {
				// setLoading(false);
			}
		};
		fetchResources();
	}, [router]);

	// Pagination calculations
	// const indexOfLastResource = currentPage * resourcesPerPage;
	// const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
	// const currentResources = resources.slice(
	// 	indexOfFirstResource,
	// 	indexOfLastResource
	// );
	// const totalPages = Math.ceil(resources.length / resourcesPerPage);

	return (
		<>
			{isChecked && (
				<div className="w-full items-center justify-center bg-[#F8F8F8]">
					<div className="container mx-auto px-4 py-[15px] flex flex-col items-center h-full mt-[100px]">
						{/* Heading */}
						<h1 className="text-[28px] text-center sm:text-[35px] font-[300] tracking-[1px]">
							Extra{" "}
							<span className="text-[#74BF44] font-[500] tracking-[1px]">
								Learning
							</span>
						</h1>
						<div className="text-center py-3 text-gray-500 tracking-[0.6px]">
							<p className="text-[#00000099] font-[400] text-[16px] sm:text-[20px] mt-2 tracking-[0.2px]">
								Discover additional resources and student contributions beyond
								your
							</p>
							<p className="text-[#00000099] font-[400] text-[16px] sm:text-[20px] mt-2 tracking-[0.2px]">
								curriculum
							</p>
						</div>

						{/* Search + Filter Row */}
						<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 w-full">
							<div className="relative w-full h-[60px] pl-6 rounded border border-gray-300 shadow-sm max-w-[690px] bg-white flex items-center  gap-3 focus-within:ring-2 focus-within:ring-gray-400">
								<Search className="text-gray-400" />
								<input
									placeholder="Search extra resources..."
									className="w-full outline-none placeholder:text-[16px] sm:placeholder:text-[18px]"
								/>
							</div>

							{/* <button
							type="button"
							className="w-full sm:w-[150px] flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded px-5 py-3 shadow-sm hover:bg-gray-100 focus:outline-none"
							onClick={() => setShowFilter((prev) => !prev)}>
							<SlidersHorizontal size={18} />
							<span className="font-[600] text-[#515151] text-[16px] sm:text-[19px]">
								Filter
							</span>
							<ChevronDown size={18} />
						</button> */}

							<ProgramDrop />
						</div>

						{/* Filter Section */}
						{/* {showFilter && (
						<div className="mt-10 sm:mt-14 flex flex-col items-center space-y-6">
							<div className="flex flex-col sm:flex-row sm:space-x-12 space-y-4 sm:space-y-0">
								<div className="flex flex-col items-center">
									<label className=" text-[18px] sm:text-[20px] font-[500] mb-2">
										Contributor
									</label>
									<ContributorDrop />
								</div>
								<div className="flex flex-col items-center">
									<label className="text-[18px] sm:text-[20px] font-[500] mb-2">
										Program
									</label>
									<ProgramDrop />
								</div>
							</div>

							<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
								<button className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600">
									Apply Filters
								</button>
								<button className="border border-gray-300 px-6 py-2 rounded shadow hover:bg-gray-100">
									Clear Filters
								</button>
							</div>
						</div>
					)} */}

						{/* Resources List */}
						<div className="mt-12 flex flex-wrap gap-4 sm:gap-6 justify-center w-full">
							{isLoading && !isError && (
								<div className="flex flex-wrap gap-4 sm:gap-6 justify-center w-full">
									{[...Array(6)].map((_, i) => (
										<ExtraBoxSkeleton key={i} />
									))}
								</div>
							)}
							{!isLoading &&
								!isError &&
								currentResources.length > 0 &&
								currentResources.map((res: ExtraResource) => (
									<ExtraBox
										key={res.id}
										Title={res.title}
										Subject={
											Array.isArray(res.keywords) ? res.keywords.join(", ") : ""
										}
										Level={res.category?.categoryName || "General"}
										Description={res.description}
										ResourcesContain={
											res.files.length > 0
												? `${res.files.length} file(s)`
												: "No files"
										}
										onClick={() => window.open(res.link, "_blank")}
									/>
								))}
							{!isLoading && !isError && currentResources.length === 0 && (
								<div className="text-center mt-20">
									<p className="text-2xl font-semibold text-[#74BF44]">
										No resources found
									</p>
									<p className="text-gray-500">Try adjusting your filters.</p>
								</div>
							)}

							{!isLoading && isError && (
								<div className="flex justify-center items-center py-16">
									<p className="text-xl font-semibold text-red-500">
										{error?.message}
									</p>
								</div>
							)}
						</div>

						{/* Pagination */}
						{/* {totalPages > 1 && (
							<div className="flex justify-center mt-8 space-x-2 flex-wrap gap-2">
								<button
									onClick={() =>
										setCurrentPage((prev) => Math.max(prev - 1, 1))
									}
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
									Prev
								</button>
								{Array.from({ length: totalPages }, (_, i) => (
									<button
										key={i + 1}
										onClick={() => setCurrentPage(i + 1)}
										className={`px-4 py-2 rounded ${
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
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
									Next
								</button>
							</div>
						)} */}

						{/* Pagination Controls */}
						{data?.totalPages > 1 && (
							<div className="flex items-center justify-center mt-8 space-x-2 flex-wrap gap-2">
								<button
									onClick={() =>
										setCurrentPage((prev) => Math.max(prev - 1, 1))
									}
									disabled={currentPage === 1}
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
									Prev
								</button>

								<p>
									Page {data?.page} of {data?.totalPages}
								</p>

								<button
									onClick={() =>
										setCurrentPage((prev) =>
											prev < (data?.totalPages ?? 1) ? prev + 1 : prev
										)
									}
									disabled={currentPage === data?.totalPages}
									className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">
									Next
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
