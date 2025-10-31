"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FetchDropdownapi } from "@/services/dropdown.service";

interface Subject {
	id: number;
	name: string;
}

interface SubjectDropdownProps {
	value?: number; // RHF will pass this
	onChange?: (value: number) => void; // RHF will pass this
}

export default function SubjectDropdown({
	value,
	onChange,
}: SubjectDropdownProps) {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [open, setOpen] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

	useEffect(() => {
		const fetchdata = async () => {
			try {
				const SubjectResponse = await FetchDropdownapi("public/faculties");
				console.log("Fetched dropdown raw:", SubjectResponse);

				const subjectList = SubjectResponse?.data;

				if (Array.isArray(subjectList) && subjectList.length > 0) {
					setSubjects(subjectList);

					// if no value yet, set default
					if (!value) {
						setSelectedSubject(subjectList[0]);
						onChange?.(subjectList[0].id); // ✅ update RHF
					} else {
						const preselected = subjectList.find((s) => s.id === value) || null;
						setSelectedSubject(preselected);
					}
				}
			} catch (error) {
				console.error("Error fetching subjects:", error);
			}
		};
		fetchdata();
	}, [value, onChange]);

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}>
			<DropdownMenuTrigger className="border-1 flex gap-4 justify-center items-center py-1.5 mt-3 w-full h-[50px] text-[16px] text-gray-500 tracking-[0.5px] bg-white border-gray-400 hover:bg-[#E7E7E7] rounded-lg">
				{selectedSubject ? selectedSubject.name : "Select subject"}
				<ChevronDown
					size={18}
					className="mt-1 text-gray-500"
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-[390px] bg-white text-gray-500 border-gray-300">
				{subjects.map((option) => (
					<DropdownMenuItem
						key={option.id}
						className="h-[40px] text-[16px] hover:bg-[#E7E7E7]"
						onSelect={() => {
							setSelectedSubject(option);
							onChange?.(option.id); // ✅ tell RHF
							setOpen(false);
						}}>
						{option.name}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
