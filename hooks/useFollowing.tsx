import fetcher from "../lib/fetcher";
import useSWR from "swr";

export default function useFollowing(id: string) {
  const { data, error, mutate } = useSWR(`/api/following/${id}`, fetcher);
  return {
    followingUsers: data?.followingUsers,
    followingPosts: data?.followingPosts,
    error,
    followingPostsMutate: mutate,
    followingUsersMutate: mutate,
  };
}
