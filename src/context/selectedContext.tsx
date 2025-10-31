"use client";

import { createContext, useContext, useState } from "react";

type SelectedContextType = {
	selectedSubjectContext: number | null;
	setselectedSubjectContext: (value: number | null) => void;

	selectedLevelContext: number | null;
	setselectedLevelContext: (value: number | null) => void;

	selectedModuleContext: number | null;
	setselectedModuleContext: (value: number | null) => void;

	selectedWeekContext: number | null;
	setselectedWeekContext: (value: number | null) => void;

	selectedCategory: number | null;
	setSelectedCategory: (value: number | null) => void;
};

const SelectedContext = createContext<SelectedContextType | undefined>(
	undefined
);

export const SelectedProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [selectedSubjectContext, setselectedSubjectContext] = useState<
		number | null
	>(null);
	const [selectedLevelContext, setselectedLevelContext] = useState<
		number | null
	>(null);
	const [selectedModuleContext, setselectedModuleContext] = useState<
		number | null
	>(null);
	const [selectedWeekContext, setselectedWeekContext] = useState<number | null>(
		null
	);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	return (
		<SelectedContext.Provider
			value={{
				selectedSubjectContext,
				setselectedSubjectContext,
				selectedLevelContext,
				setselectedLevelContext,
				selectedModuleContext,
				setselectedModuleContext,
				selectedWeekContext,
				setselectedWeekContext,
				selectedCategory,
				setSelectedCategory,
			}}>
			{children}
		</SelectedContext.Provider>
	);
};

export const useSelected = () => {
	const context = useContext(SelectedContext);
	if (!context)
		throw new Error("useSelected must be used inside SelectedProvider");
	return context;
};
