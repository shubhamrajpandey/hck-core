"use client";

import { useEffect, useRef, useState } from "react";
import { useSelected } from "@/context/selectedContext";
import { useGetLevels } from "@/services/dropdown.service";
import { Level } from "@/services/modules.service";

export default function LevelDropdown() {
	const { data: levels, error, isLoading } = useGetLevels();

	const [isOpen, setIsOpen] = useState(false);
	const { selectedLevelContext, setselectedLevelContext } = useSelected();
	const [selectedLevel, setSelectedLevel] = useState<string | undefined>();

	const dropdownRef = useRef<HTMLDivElement>(null);

	// keep state in sync with context + fetched data
	useEffect(() => {
		if (levels?.data?.length) {
			const found = levels.data.find(
				(l: Level) => l.id === selectedLevelContext
			);
			if (found) {
				setSelectedLevel(found.name);
			} else {
				const defaultLevel =
					levels.data.find((l: Level) => l.name.toLowerCase() === "level 4") ??
					levels.data[0];

				setSelectedLevel(defaultLevel.name);
				setselectedLevelContext(defaultLevel.id);
			}
		}
	}, [levels, selectedLevelContext, setselectedLevelContext]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSelect = (option: Level) => {
		setSelectedLevel(option.name);
		setselectedLevelContext(option.id);
		setIsOpen(false);
	};

	return (
		<div
			ref={dropdownRef}
			className="relative w-full max-w-md sm:max-w-[180px] h-fit rounded-md">
			<button
				onClick={() => !isLoading && setIsOpen(!isOpen)}
				className="group flex items-center justify-between gap-3 px-4 sm:px-7 py-3 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md w-full h-13 hover:text-white hover:bg-[#74BF44] hover:border-none transition duration-200 cursor-pointer text-[16px] sm:text-[20px]"
				disabled={isLoading || !!error}>
				{error && !isLoading && (
					<span className="text-red-500 text-[14px] sm:text-[16px]">
						Error loading levels
					</span>
				)}
				{isLoading && (
					<div className="flex justify-center items-center w-full">
						<div className="h-6 w-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
					</div>
				)}

				{!isLoading && !error && selectedLevel && (
					<>
						<span className="truncate">{selectedLevel}</span>
						<svg
							width="18"
							height="18"
							viewBox="0 0 14 8"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								className="fill-black group-hover:fill-white opacity-40 group-hover:opacity-100 transition duration-200"
								d="M7.71906 7.55714C7.53153 7.74461 7.27723 7.84992 7.01206 7.84992C6.7469 7.84992 6.49259 7.74461 6.30506 7.55714L0.648062 1.90014C0.552552 1.80789 0.476369 1.69754 0.42396 1.57554C0.371551 1.45354 0.343965 1.32232 0.342811 1.18954C0.341657 1.05676 0.366959 0.925078 0.41724 0.802182C0.467521 0.679285 0.541774 0.567633 0.635667 0.47374C0.72956 0.379847 0.841211 0.305594 0.964108 0.255313C1.087 0.205033 1.21868 0.179731 1.35146 0.180885C1.48424 0.182039 1.61546 0.209625 1.73747 0.262034C1.85947 0.314443 1.96982 0.390625 2.06206 0.486135L7.01206 5.43614L11.9621 0.486135C12.1507 0.303977 12.4033 0.203183 12.6655 0.205461C12.9277 0.20774 13.1785 0.312908 13.3639 0.498316C13.5493 0.683725 13.6545 0.934537 13.6567 1.19673C13.659 1.45893 13.5582 1.71153 13.3761 1.90014L7.71906 7.55714Z"
							/>
						</svg>
					</>
				)}
			</button>

			{/* Dropdown Menu */}
			{isOpen && levels?.data && (
				<div className="absolute mt-2 w-full sm:w-[180px] bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
					{levels.data.map((option: Level) => (
						<div
							key={option.id}
							onClick={() => handleSelect(option)}
							className="flex items-center gap-3 pl-7 py-2 hover:bg-gray-100 cursor-pointer text-[18px] sm:text-[20px] truncate">
							{option.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
