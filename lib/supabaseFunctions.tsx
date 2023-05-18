import { supabase } from "./supabase";
import { ChatProps } from "../types/interface";

// テーブル名
export const tableName = "ChatMessages";

// チャットのデータを全て取得する(とりあえず動作の確認のため)
export const fetchData = async () => {
  try {
    const { data } = await supabase
      .from(tableName)
      .select("*")
      .order("createdAt");
    return data;
  } catch (error) {
    console.error(error);
  }
};

// チャットのデータを追加する
export const addData = async ({ senderId, receiverId, message }: ChatProps) => {
  try {
    const result = await supabase
      .from(tableName)
      .insert({ senderId, receiverId, message });
    console.log("result: ", result);
  } catch (error) {
    console.error(error);
  }
};
