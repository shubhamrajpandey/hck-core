import axios from "axios";
import { axiosInstance } from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export default async function FetchWeekbyModuleid(
	endpoint: number | null,
	params?: Record<string, string>
) {
	if (endpoint === null) {
		throw new Error("Module ID (endpoint) is required but was null");
	}

	try {
		const response = await axiosInstance.get(`/modules/${endpoint}/weeks`, {
			params,
		});
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

export const useFetchWeeksByModuleId = (moduleId: number) => {
	return useQuery({
		queryKey: ["weeks", moduleId],
		queryFn: async () => {
			const response = await axiosInstance.get(`/modules/${moduleId}/weeks`);

			return response.data.data;
		},
	});
};
