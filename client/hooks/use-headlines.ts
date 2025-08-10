import { useQuery } from "@tanstack/react-query";
import { HeadlinesResponse, NewsSource, ApiError } from "../../shared/api";

const API_BASE_URL = "http://localhost:8000"; // Update this to match your backend URL

/**
 * Fetch headlines from the backend API
 */
const fetchHeadlines = async (source: NewsSource): Promise<HeadlinesResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/headlines?source=${source}`);
  
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new Error(errorData.error || "Failed to fetch headlines");
  }
  
  return response.json();
};

/**
 * Custom hook for fetching headlines with React Query
 */
export const useHeadlines = (source: NewsSource) => {
  return useQuery({
    queryKey: ["headlines", source],
    queryFn: () => fetchHeadlines(source),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}; 