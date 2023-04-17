import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useCommentDetail = (id: string) => {
  const { data, error } = useSWR(`/api/comment/${id}`, fetcher);

  return {
    comment: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useCommentDetail;
