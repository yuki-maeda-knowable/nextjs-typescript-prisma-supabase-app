import React, { useState } from "react";
import { Button } from "@mui/material";
import { useCallback, useEffect } from "react";
import useFollow from "../hooks/useFollow";
import { FollowButtonProps } from "../types/interface";

const FollowButton: React.FC<FollowButtonProps> = ({ followerId }) => {
  // followテーブルの情報を取得し、キャッシュも保持する
  const { data: followData = [], mutate: mutateFollow } = useFollow();

  // followボタンの状態を管理
  const [isFollow, setIsFollow] = useState<boolean>(false);

  //useEffectを利用して、followされているかを判定する
  useEffect(() => {
    const list = followData.map((item) => item.followerId);
    setIsFollow(list.includes(followerId));
  }, [followData, followerId, setIsFollow, isFollow]);

  // follow処理 start //
  const toggleFollow = useCallback(async () => {
    // followの登録/削除を行う
    const res = await fetch("/api/follows/toggleFollow", {
      //trueなら、followの削除、falseならfollowの登録
      method: isFollow ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followerId: followerId,
      }),
    });
    const data = await res.json();

    // followの登録/削除が成功したら、followの状態を反転させる
    setIsFollow(!isFollow);
    // 最初に取得したリストを、followした/follow削除したリストを更新する
    mutateFollow([...followData, data]);
  }, [isFollow, followerId, mutateFollow]);
  return (
    <>
      <Button size="small" onClick={toggleFollow}>
        {isFollow ? "フォローを外す" : "フォローする"}
      </Button>
    </>
  );
};

export default FollowButton;
