import fetcher from "../lib/fetcher";
import useSWR from "swr";

const useUsers = () => {
  const { data, error, mutate } = useSWR("/api/user", fetcher);

  return {
    data,
    error,
    mutate,
  };
};

export default useUsers;
