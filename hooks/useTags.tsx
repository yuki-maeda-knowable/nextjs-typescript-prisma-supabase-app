import useSWR from "swr";
import fetcher from "../lib/fetcher";

export default function useTags() {
  const { data, error, mutate } = useSWR("/api/tags", fetcher);
  return {
    data,
    error,
    mutate,
  };
}
