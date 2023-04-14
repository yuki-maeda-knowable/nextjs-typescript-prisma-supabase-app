import useSWR from "swr";
import fetcher from "../lib/fetcher";

const useSortedTags = () => {
  const { data, mutate } = useSWR("/api/tags/sortedTags", fetcher);

  return {
    data,
    mutate,
  };
};

export default useSortedTags;
