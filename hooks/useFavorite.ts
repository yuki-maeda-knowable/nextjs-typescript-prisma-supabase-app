import useSwr from "swr";
import fetcher from "../lib/fetcher";

const useFavorite = () => {
  const { data, error, mutate } = useSwr("/api/favorites", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });
  return {
    data,
    error,
    mutate,
  };
};

export default useFavorite;
