import axios from "axios";
import { axiosInstance } from "@/services/axiosInstance";
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

export type Module = {
	id: number;
	name: string;
	description: string;
	code: string;
	leader: string;
	levelId: number;
	level: Level;
};

type ApiResponse<T> = { data: T };

export async function fetchModule(endpoint: string, data?: Module) {
	try {
		const url = `/levels/${endpoint}/modules`;
		const response = await axiosInstance.get(url, { params: data });

		// if API returns { error: "..."} treat as "no module"
		if (response.data.error) {
			return null;
		}
		console.log(response);
		return response.data.data || [];
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.log("API Error:", error.response?.data || error.message);
		} else {
			console.error("Unknown API Error", error);
		}
		return null; // return null instead of throwing
	}
}

export function useFetchModule(facultyId: number) {
	return useQuery({
		queryKey: ["modules", facultyId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/levels/${facultyId}/modules`);

			return response.data.data;
		},
		enabled: !!facultyId,
	});
}

export const useGetFaculty = () => {
	return useQuery<Faculty>({
		queryKey: ["faculty"],
		queryFn: async () => {
			const response = await axiosInstance.get<ApiResponse<Faculty>>(
				"student/faculty"
			);

			return response.data.data;
		},
	});
};
