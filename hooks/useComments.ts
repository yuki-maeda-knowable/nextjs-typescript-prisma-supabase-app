import useSWR from "swr";
import fetcher from "../lib/fetcher";

export default function useComments(postId: string) {
  const { data, error, mutate } = useSWR(
    postId ? `/api/post/${postId}/comments` : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
