import useSwr from "swr";
import fetcher from "../lib/fetcher";

const usePost = () => {
  const { data, error, isLoading, mutate } = useSwr("/api/post", fetcher, {
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default usePost;
