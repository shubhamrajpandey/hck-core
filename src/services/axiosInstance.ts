import axios from "axios";

const baseUrl =
	process.env.NEXT_PUBLIC_Fetch_Dropdown_URL ||
	"https://herald-hub-backend.onrender.com";

export const axiosInstance = axios.create({
	baseURL: baseUrl,
	timeout: 20000, // increased timeout because it takes a lot of time to fetch data if kept lower then the fetch would have been interupted
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use((config) => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem("token") || sessionStorage.getItem("token")
			: null;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);
