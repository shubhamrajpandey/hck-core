import { axiosInstance } from "@/services/axiosInstance";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";

export type Faculty = {
	id: number;
	name: string;
};

export type Level = {
	id: number;
	name: string;
	facultyId: number;
	faculty: Faculty;
};

type LevelsResponse = { data: Level[] };

// `student/levels`

export async function FetchDropdownapi(
	endpoint: string,
	method: "GET" | "POST" = "GET",
	data?: Level
) {
	console.log("wde " + endpoint, method, data);

	try {
		const response =
			method === "POST"
				? await axiosInstance.post(endpoint, data)
				: await axiosInstance.get(endpoint, { params: data });

		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error("API Error:", error.response?.data || error.message);
		} else if (error instanceof Error) {
			console.error("Error:", error.message);
		} else {
			console.error("Unexpected error:", error);
		}
		throw error;
	}
}

export const useGetLevels = () => {
	return useQuery<LevelsResponse>({
		queryKey: ["levels"],
		queryFn: async () => {
			const response = await axiosInstance.get<LevelsResponse>(
				"student/levels"
			);

			return response.data;
		},
	});
};

export const useGetCategories = () => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const response = await axiosInstance.get("categories");

			return response.data.data;
		},
	});
};
