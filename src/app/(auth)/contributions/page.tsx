"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { File, Link, X } from "lucide-react";
import CategoryDropDown from "@/components/dropdown/CategoryDropDown";
import { toast } from "react-hot-toast";

type ResourceFile = {
	name: string;
	file: File;
};

function Contributions() {
	const router = useRouter();
	const [isChecked, setIsChecked] = useState(false);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [keywords, setKeywords] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [files, setFiles] = useState<ResourceFile[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [links, setLinks] = useState<string[]>([]);
	const [showLinkInput, setShowLinkInput] = useState(false);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null
	);
	const [newLink, setNewLink] = useState("");

	useEffect(() => {
		const StoredToken =
			localStorage.getItem("token") || sessionStorage.getItem("token");
		const RoleSelected =
			localStorage.getItem("Role") || sessionStorage.getItem("Role");
		if (RoleSelected !== "Student" || !StoredToken) {
			router.push("/");
		}
		setIsChecked(true);
	}, [router]);

	const handleAddFileClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const newFiles: ResourceFile[] = Array.from(event.target.files).map(
				(file) => ({ name: file.name, file })
			);
			setFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddLinkClick = () => {
		setShowLinkInput(true);
	};

	const handleSaveLink = () => {
		if (newLink.trim() !== "") {
			setLinks((prev) => [...prev, newLink.trim()]);
			setNewLink("");
			setShowLinkInput(false);
		}
	};

	const handleRemoveLink = (index: number) => {
		setLinks((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!title || !description || !selectedCategoryId || !keywords) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (files.length === 0 && links.length === 0) {
			toast.error("Please add at least one file or link");
			return;
		}

		setIsSubmitting(true);
		const loadingToast = toast.loading("Submitting resource...");

		try {
			const token =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			const formData = new FormData();
			formData.append("requestTitle", title);
			formData.append("requestDescription", description);
			formData.append("keywords", keywords);
			formData.append("categoryId", selectedCategoryId.toString());

			if (links.length > 0) {
				formData.append("link", links[0]);
			}

			files.forEach((file) => {
				formData.append("files", file.file);
			});

			const response = await fetch(
				"https://herald-hub-backend.onrender.com/resource-request",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log("Success:", result);

			toast.dismiss(loadingToast);
			toast.success("Resource request submitted successfully!");

			setTitle("");
			setDescription("");
			setKeywords("");
			setSelectedCategoryId(null);
			setFiles([]);
			setLinks([]);
		} catch (error) {
			console.error("Error submitting resource request:", error);
			toast.dismiss(loadingToast);
			toast.error("Failed to submit resource request. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{isChecked && (
				<div className="w-full flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
					<div className="bg-white w-full max-w-5xl p-6 sm:p-10 rounded-md shadow-md overflow-hidden mt-[100px]">
						<div className="text-center mb-8">
							<h1 className="text-[28px] sm:text-[35px] font-[300] tracking-[1px]">
								Submit{" "}
								<span className="text-[#74BF44] font-[500] tracking-[1px]">
									Resource
								</span>
							</h1>
							<p className="text-[#00000099] font-[400] text-[16px] sm:text-[20px] mt-2 tracking-[0.2px]">
								Share educational content with the Herald College community
							</p>
						</div>

						<form
							className="space-y-6"
							onSubmit={handleSubmit}>
							<div>
								<label className="block text-[16px] sm:text-[18px] font-[500] mb-3 tracking-[-0.2px] text-[#00000099]">
									Title <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Enter resource title"
									className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-[14px] sm:placeholder:text-[16px]"
									required
								/>
							</div>

							<div>
								<label className="block text-[16px] sm:text-[18px] font-[500] mb-3 tracking-[-0.2px] text-[#00000099]">
									Description <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Enter description"
									className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder:text-[14px] sm:placeholder:text-[16px]"
									required
								/>
							</div>

							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1 min-w-[220px] sm:min-w-[250px]">
									<label className="block text-[16px] sm:text-[18px] font-[500] mb-3 tracking-[-0.2px] text-[#00000099]">
										Category <span className="text-red-500">*</span>
									</label>
									<CategoryDropDown
										selectedCategoryId={selectedCategoryId}
										setSelectedCategoryId={setSelectedCategoryId}
									/>
								</div>

								<div className="flex-1 min-w-[220px] sm:min-w-[250px]">
									<label className="block text-[16px] sm:text-[18px] font-[500] mb-3 tracking-[-0.2px] text-[#00000099]">
										Language/Tag <span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										value={keywords}
										onChange={(e) => setKeywords(e.target.value)}
										placeholder="React, JS (comma separated)"
										className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
										required
									/>
								</div>
							</div>

							<div className="mt-6 sm:mt-9 w-full max-w-[1423px] bg-white rounded-[7px] border border-gray-300 p-4 sm:p-10">
								<h1 className="text-[16px] sm:text-[20px] font-[600] tracking-[0.5px] text-[#000000A6] mb-1">
									Attachments <span className="text-red-600">*</span>
								</h1>
								<p className="text-[14px] sm:text-[16px] font-[400] text-gray-500 tracking-[-0.2px] mt-2">
									Upload multiple files and add multiple external links to
									support your resource
								</p>

								<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4 mb-4 gap-4">
									<h1 className="text-[16px] sm:text-[18px] font-[500] tracking-[-0.2px]">
										Files ({files.length})
									</h1>
									<button
										type="button"
										onClick={handleAddFileClick}
										className="flex items-center gap-2 sm:gap-4 w-full sm:w-[170px] h-[40px] rounded-[7px] text-[13px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer">
										<File size={14} />
										Add Another File
									</button>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										className="hidden"
										multiple
									/>
								</div>

								{files.length === 0 ? (
									<div className="border border-dashed border-gray-400 rounded-[7px] h-[200px] sm:h-[280px] flex flex-col items-center justify-center text-gray-500">
										<File size={60} />
										<p className="mt-5 text-[15px] sm:text-[17px] text-gray-400 font-[400]">
											No files added yet
										</p>
										<button
											type="button"
											onClick={handleAddFileClick}
											className="mt-4 w-[180px] sm:w-[220px] h-[40px] rounded-[7px] border border-gray-400 text-[14px] sm:text-[15px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center">
											<span className="text-[22px] sm:text-[25px] mr-2 sm:mr-4">
												+
											</span>{" "}
											Add Your First File
										</button>
									</div>
								) : (
									<div className="border border-dashed border-gray-400 rounded-[7px] p-2 sm:p-4">
										{files.map((file, index) => (
											<div
												key={index}
												className="flex items-center justify-between border-b py-1 sm:py-2">
												<span className="text-gray-700 text-sm sm:text-[16px]">
													{file.name}
												</span>
												<button
													type="button"
													onClick={() => handleRemoveFile(index)}
													className="text-red-500 hover:text-red-700">
													<X size={20} />
												</button>
											</div>
										))}
									</div>
								)}

								<div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-6 mb-4 gap-4">
									<h1 className="text-[16px] sm:text-[18px] font-[500] tracking-[-0.2px]">
										External Links ({links.length})
									</h1>
									<button
										type="button"
										onClick={handleAddLinkClick}
										className="flex items-center gap-2 sm:gap-4 w-full sm:w-[180px] h-[40px] rounded-[7px] text-[13px] sm:text-[13px] font-[600] text-gray-600 border border-gray-400 px-4 hover:bg-[#6868681A] cursor-pointer">
										<Link size={14} />
										Add Another Link
									</button>
								</div>

								{showLinkInput && (
									<div className="flex flex-col sm:flex-row mb-4 items-start sm:items-center gap-2">
										<input
											type="text"
											value={newLink}
											onChange={(e) => setNewLink(e.target.value)}
											placeholder="Enter link"
											className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
										/>
										<button
											type="button"
											onClick={handleSaveLink}
											className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
											Save
										</button>
										<button
											type="button"
											onClick={() => setShowLinkInput(false)}
											className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
											Cancel
										</button>
									</div>
								)}

								{links.length === 0 ? (
									<div className="border border-dashed border-gray-400 rounded-[7px] h-[200px] sm:h-[280px] flex flex-col items-center justify-center text-gray-500">
										<Link size={60} />
										<p className="mt-5 text-[15px] sm:text-[17px] text-gray-400 font-[400]">
											No external links added yet
										</p>
										<button
											type="button"
											onClick={handleAddLinkClick}
											className="mt-4 w-[180px] sm:w-[240px] h-[40px] rounded-[7px] border border-gray-400 text-[14px] sm:text-[15px] font-[600] text-gray-600 tracking-[0.2px] cursor-pointer hover:bg-[#6868681A] flex items-center justify-center">
											<span className="text-[22px] sm:text-[25px] mr-2 sm:mr-4">
												+
											</span>{" "}
											Add Your First Link
										</button>
									</div>
								) : (
									<div className="border border-dashed border-gray-400 rounded-[7px] p-2 sm:p-4">
										{links.map((link, index) => (
											<div
												key={index}
												className="flex items-center justify-between border-b py-1 sm:py-2">
												<span className="text-gray-700 text-sm sm:text-[16px]">
													{link}
												</span>
												<button
													type="button"
													onClick={() => handleRemoveLink(index)}
													className="text-red-500 hover:text-red-700">
													<X size={20} />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="pt-4">
								<button
									type="submit"
									className="w-full py-3 rounded-md bg-[#74BF44] text-white font-medium cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
									disabled={isSubmitting}>
									{isSubmitting ? "Submitting..." : "Submit Resource"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}

export default Contributions;
