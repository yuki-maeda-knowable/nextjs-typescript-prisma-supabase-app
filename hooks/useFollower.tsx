import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useFollower = () => {
  const { data, error, mutate } = useSWR(`api/follower`, fetcher);
  return {
    data,
    error,
    mutate,
  };
};
export default useFollower;
