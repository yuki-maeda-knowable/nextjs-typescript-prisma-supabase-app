import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useComments = (postId: string) => {
  const { data, error, mutate } = useSWR(
    postId ? `/api/post/${postId}/comments` : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
};

export default useComments;
