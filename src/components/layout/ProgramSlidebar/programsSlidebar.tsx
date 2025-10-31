"use client";

import { ReactNode, useEffect, useState } from "react";
import FetchWeekbyModuleid from "@/services/fetchWeekbyModuleid";
import { useSelected } from "@/context/selectedContext";

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

export default function ProgramsSlidebar({
	children,
}: {
	children: ReactNode;
}) {
	const { selectedModuleContext, setselectedWeekContext } = useSelected();
	const [data, setData] = useState<Week[]>([]);
	const [selectedWeek, setselectedWeek] = useState<string>("Week 1");

	useEffect(() => {
		console.log("selected Module id after selected:", selectedModuleContext);
		setselectedWeekContext(1);
		const fetchData = async () => {
			const StoredToken =
				localStorage.getItem("token") || sessionStorage.getItem("token");

			if (!StoredToken) {
				console.log("No token found");
				return;
			}
			try {
				const result = await FetchWeekbyModuleid(selectedModuleContext);
				console.log("Weeks from API:", result);
				setData(result.data);
			} catch (error) {
				console.error("Failed to fetch weeks:", error);
			}
		};

		if (selectedModuleContext) {
			fetchData();
		}
	}, [selectedModuleContext, setselectedWeekContext]);

	return (
		<div className="flex z-10 gap-5 overflow-hidden mt-20">
			<div className="flex flex-col items-center min-w-80 gap-[20px] border-r border-[#68686866] ">
				<div className="w-full items-center justify-center flex pl-15 mt-[55px]">
					<span className="text-[000] text-[30px] font-[500]">All Weeks</span>
				</div>
				<div>
					<ul className="flex flex-col gap-[20px]">
						{data.map((Week) => {
							return (
								<li
									key={Week.weekId}
									className={`cursor-pointer ${
										selectedWeek === Week.weekName
											? "text-[#74BF44] underline"
											: "text-black hover:text-[#74BF44] hover:underline"
									} text-[20px] font-[300] border-solid`}
									onClick={() => {
										setselectedWeek(Week.weekName);
										setselectedWeekContext(Week.weekId);
									}}>
									{Week.weekName}
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<div className="flex-1 overflow-x-hidden px-5 pb-5">{children}</div>
		</div>
	);
}
