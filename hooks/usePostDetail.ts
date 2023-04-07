import useSWR from "swr";
import fetcher from "../lib/fetcher";

const usePostDetail = (id: string) => {
  const { data, error } = useSWR(`/api/post/${id}/postEdit`, fetcher);
  return {
    data,
    error,
  };
};

export default usePostDetail;
