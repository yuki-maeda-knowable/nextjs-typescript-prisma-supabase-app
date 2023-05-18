import fetcher from "../lib/fetcher";
import useSWR from "swr";

const useChats = (chatRoomId) => {
  const { data, error, mutate } = useSWR(
    `/api/chatMessages/${chatRoomId}`,
    fetcher
  );
  return {
    data,
    error,
    mutate,
  };
};

export default useChats;
