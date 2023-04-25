import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useFollowingCount = () => {
  const { data, error, mutate } = useSWR(
    `/api/following/followingCount`,
    fetcher
  );
  return {
    data,
    error,
    mutate,
  };
};

export default useFollowingCount;
