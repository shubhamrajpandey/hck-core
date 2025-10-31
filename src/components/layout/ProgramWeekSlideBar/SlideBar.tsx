"use client";

import React, { useEffect } from "react";
import { useSelected } from "@/context/selectedContext";
import { useFetchWeeksByModuleId } from "@/services/fetchWeekbyModuleid";
import WeekDropdown from "@/components/dropdown/Resourceweekdropdown";

interface Faculty {
	id: number;
	name: string;
}

interface Level {
	id: number;
	name: string;
	facultyId: number;
	faculty: Faculty;
}

interface Module {
	id: number;
	name: string;
	description: string;
	code: string;
	leader: string;
	levelId: number;
	level: Level;
}
export interface Week {
	weekId: number;
	weekName: string;
	moduleId: number;
	module: Module;
}

const SlideBar = () => {
	const { selectedModuleContext, selectedWeekContext, setselectedWeekContext } =
		useSelected();
	const {
		data: weeks,
		isError,
		error,
		isLoading,
	} = useFetchWeeksByModuleId(selectedModuleContext || 1);

	useEffect(() => {
		if (weeks && weeks.length > 0 && !selectedWeekContext) {
			setselectedWeekContext(weeks[0].weekId);
		}
	}, [weeks, selectedWeekContext, setselectedWeekContext]);

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center min-w-80 border-r border-[#68686866] p-5 pt-30">
				<span className="text-red-500 text-lg">
					Failed to load weeks: {error?.message || "Unknown error"}
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center min-w-80 gap-5 border-r border-[#68686866]  pt-30">
			<div className="w-full flex justify-center">
				<span className="text-[#000] text-[30px] font-medium">All Weeks</span>
			</div>

			{isLoading && !isError && (
				<ul className="flex flex-col gap-8 w-full mt-4 animate-pulse">
					{Array.from({ length: 10 }).map((_, i) => (
						<li
							key={i}
							className="h-8 bg-gray-200 rounded w-2/4 mx-auto"></li>
					))}
				</ul>
			)}

			<ul className="hidden flex-col md:flex gap-5">
				{!isLoading &&
					weeks &&
					weeks.length > 0 &&
					weeks.map((week: Week, index: number) => (
						<li
							key={week.weekId || index}
							className={`cursor-pointer hover:text-[#74BF44] hover:underline text-[20px] font-light transition-colors capitalize ${
								week.weekId === selectedWeekContext
									? "text-[#74BF44]"
									: " text-black"
							}`}
							onClick={() => {
								setselectedWeekContext(week.weekId);
							}}>
							{week.weekName || `Week ${index + 1}`}
						</li>
					))}
				{!isLoading && weeks.length === 0 && (
					<li className="text-gray-500 text-lg">No weeks available</li>
				)}
			</ul>

			<div className="flex justify-center md:hidden w-full px-4 mt-4">
				<WeekDropdown />
			</div>
		</div>
	);
};

export default SlideBar;
