import React, { useMemo, useState } from "react";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useCallback } from "react";
import useFavorite from "../hooks/useFavorite";
import useFavoriteCount from "../hooks/useFavoriteCount";

//親から渡されるpropsの型を定義
interface FavoriteButtonProps {
  postId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ postId }) => {
  //useFavoriteを利用して、キャッシュを保持する
  const { mutate: mutateFavorites, data: favoriteData = [] } = useFavorite();
  const { mutate: mutateFavoriteCount, data: favoriteCount = 0 } =
    useFavoriteCount(postId);

  const isFavorite = useMemo(() => {
    const list = favoriteData.map((item) => item.postId);
    //listにpostIdが含まれているかをtrue, falseで返す
    return list.includes(postId);
  }, [favoriteData]);

  const toggleFavorite = useCallback(async () => {
    //いいねの登録/削除を行う
    const res = await fetch("/api/favorites/favorite", {
      //trueなら、いいねの削除、falseならいいねの登録
      method: isFavorite ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
      }),
    });
    //いいねの登録が完了したら、いいねの情報を返す
    const data = await res.json();

    //いいねしたリストのキャッシュを更新する
    //最初に取得したリストを、いいねした/いいね削除したリストを更新する
    // mutateFavorites([...favoriteData, data]);
    mutateFavorites();
    //いいねの数も更新する
    mutateFavoriteCount();
  }, [isFavorite, postId, mutateFavorites]);

  return (
    <IconButton onClick={toggleFavorite} aria-label="add to favorites">
      <Checkbox
        checked={isFavorite}
        checkedIcon={<Favorite sx={{ color: "red" }} />}
        icon={<FavoriteBorder />}
      />
      <Typography
        variant="body1"
        fontSize={"0.7rem"}
        sx={{ position: "absolute", right: "9px" }}
      >
        {favoriteCount}
      </Typography>
    </IconButton>
  );
};

export default FavoriteButton;
