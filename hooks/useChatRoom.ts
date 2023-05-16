import fetcher from "../lib/fetcher";
import useSWR from "swr";

const useChatRoom = (chatRoomId: string) => {
  const { data, error, mutate } = useSWR(
    `/api/chatRooms/${chatRoomId}`,
    fetcher
  );
  return {
    data,
    error,
    mutate,
  };
};

export default useChatRoom;
