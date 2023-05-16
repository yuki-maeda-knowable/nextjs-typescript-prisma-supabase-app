import { Typography, TextField, Button, Avatar, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { ChatProps } from "../types/interface";
import useCurrentUser from "../hooks/useCurrentUser";
import { tableName } from "../lib/supabaseFunctions";
import { supabase } from "../lib/supabase";
import useChats from "../hooks/useChats";
import useChatRoom from "../hooks/useChatRoom";

const Chat = ({ chatRoomId }) => {
  const { data: chatRoom } = useChatRoom(chatRoomId);
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [messageTexts, setMessageTexts] = useState<ChatProps[]>([]); // メッセージ
  const { data: user } = useCurrentUser();

  const senderId = user?.id;
  // チャット相手のIDを取得。自分のIDと一致しない方を取得する
  const receiverId =
    senderId === chatRoom?.initiatorId
      ? chatRoom?.recipientId
      : chatRoom?.initiatorId;

  //senderIdが自分だったら相手の名前を表示する
  const receiverName =
    senderId === chatRoom?.initiatorId
      ? chatRoom?.recipient?.name
      : chatRoom?.initiator?.name;

  // chatRoomIdに紐付いたチャットをchatMessagesテーブルから取得する
  const { data: chats, mutate: mutateChats } = useChats(chatRoomId);

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
    try {
      const result = supabase
        .channel(`${chatRoomId}`) // 任意のチャンネル名 1対1のチャットなら、ユニークなIDを指定する
        .on(
          "postgres_changes", // ここは固定
          {
            event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
            schema: "public",
            table: tableName, // DBのテーブル名
          },
          (payload) => {
            // データ登録
            if (payload.eventType === "INSERT") {
              console.log("payload: ", payload);
              const { createdAt, id, message, senderId, receiverId } =
                payload.new;
              setMessageTexts((messageText) => [
                ...messageText,
                { createdAt, id, message, senderId, receiverId },
              ]);
            }
          }
        )
        .subscribe();
      // リスナーの解除
      return () => supabase.channel(`${chatRoomId}`).unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    //api経由でデータ追加
    const res = await fetch(`/api/chatMessages/${chatRoomId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputText,
        senderId: senderId,
        receiverId: receiverId,
        chatRoomId: chatRoomId,
      }),
    });
    const data = await res.json();
    mutateChats();
    setInputText("");
  };

  // useEffectで、チャットのデータを取得する
  useEffect(() => {
    (async () => {
      await setMessageTexts(chats);
    })();
    fetchRealtimeData();
  }, [chats, fetchRealtimeData]);

  return (
    <Box>
      <Typography variant="h6">{receiverName}さんとのルーム</Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box>
          {messageTexts?.map((messageText) => (
            <Box
              display={"flex"}
              sx={{ mt: 2 }}
              key={messageText.id}
              alignItems={
                messageText.senderId === senderId ? "flex-end" : "flex-start"
              }
              justifyContent={
                messageText.senderId === senderId ? "flex-end" : "flex-start"
              }
            >
              <Box
                ml={messageText.senderId === senderId ? 1 : 0}
                mr={messageText.senderId === senderId ? 0 : 1}
              >
                {messageText.senderId === senderId ? (
                  ""
                ) : (
                  <Avatar
                    src={
                      messageText?.sender?.image
                        ? messageText?.sender?.image
                        : ""
                    }
                  />
                )}
              </Box>
              <Typography
                // senderなら右寄せ、receiverなら左寄せ
                variant="body2"
                sx={{
                  ml: 2,
                  mt: 1,
                  borderRadius: "10px",
                  boxShadow: "0px 2.5px 5px 0.1px rgb(138, 149, 156)",
                  p: 1,
                  backgroundColor:
                    messageText.senderId === senderId ? "#5f78ff" : "#f5f5f5",
                  color:
                    messageText.senderId === senderId ? "#ffffff" : "#000000",
                }}
              >
                {messageText.message}
              </Typography>
            </Box>
          ))}
          <Box
            component="form"
            onSubmit={handleSubmitMessage}
            display={"flex"}
            justifyContent={"center"}
            sx={{ mt: 2 }}
          >
            <TextField
              placeholder="new message"
              value={inputText}
              type="text"
              onChange={(e) => setInputText(e.target.value)}
              size="small"
            />

            <Button
              type="submit"
              variant="outlined"
              color="primary"
              disabled={!inputText}
              sx={{ ml: 1, height: 40 }}
            >
              送信
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
