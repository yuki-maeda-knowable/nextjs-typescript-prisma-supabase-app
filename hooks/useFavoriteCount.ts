import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useFavoriteCount = (postId) => {
  const { data, error, mutate } = useSWR(
    `/api/post/${postId}/favoritesCount/`,
    fetcher
  );
  return {
    data,
    error,
    mutate,
  };
};

export default useFavoriteCount;
