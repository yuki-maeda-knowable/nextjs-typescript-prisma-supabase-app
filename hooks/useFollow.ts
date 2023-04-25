import fetcher from "../lib/fetcher";
import useSWR from "swr";

const useFollow = () => {
  const { data, error, mutate } = useSWR("/api/follows", fetcher);
  return {
    data,
    error,
    mutate,
  };
};

export default useFollow;
