import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useMatches = () => {
  const { data, error, mutate } = useSWR("/api/matches", fetcher);

  return {
    data,
    error,
    mutate,
  };
};

export default useMatches;
