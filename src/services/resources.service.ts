import axios from "axios";
import { axiosInstance } from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export type ExtraResourcesProps = {
	page?: number;
	limit?: number;
	categoryId?: number | null;
};

export default async function FetchResourcesSlidebar(endpoint: string) {
	try {
		const response = await axiosInstance.get(`weeks/${endpoint}/week-contents`);
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error("API Error:", error.response?.data || error.message);
		} else if (error instanceof Error) {
			console.error("API Error:", error.message);
		} else {
			console.error("Unknown API Error", error);
		}
		throw error;
	}
}

export const useFetchProgramWeek = (
	weekId: number | null,
	moduleId: number | null
) => {
	return useQuery({
		queryKey: ["programWeeks", moduleId],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`modules/${moduleId}/week-contents`
			);

			return response.data;
		},
	});
};

export const useFetchExtraResources = ({
	page = 1,
	limit = 10,
}: ExtraResourcesProps) => {
	return useQuery({
		queryKey: ["extra-resources", page],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`/extra-resources?page=${page}&limit=${limit}`
			);

			return {
				resources: response.data.data.resources,
				page: response.data.data.page,
				totalPages: response.data.data["total pages"],
			};
		},
	});
};

export const useFetchExtraResourcesByCategories = ({
	page = 1,
	limit = 10,
	categoryId,
}: ExtraResourcesProps) => {
	return useQuery({
		queryKey: ["extra-resources", categoryId, page],
		queryFn: async () => {
			const response = await axiosInstance.get(
				`categories/${categoryId}/extra-resources?page=${page}&limit=${limit}`
			);

			return {
				resources: response.data.data.resources,
				page: response.data.data.page,
				totalPages: response.data.data["total pages"],
			};
		},
		enabled: !!categoryId,
	});
};
