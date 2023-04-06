import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useUser = (id: string) => {
  const { data, error } = useSWR(`/api/user/${id}`, fetcher);

  return {
    data,
    error,
  };
};

export default useUser;
