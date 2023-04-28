// ユーザ詳細の型定義

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  posts?: PostProps[];
}

// ユーザプロフィールの型定義
export interface ProfileProps {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
}

//ユーザのプロフィール投稿の型定義
export interface ProfileFormProps {
  nickname: string;
  photo?: [];
  gender: number;
  birthday: Date;
}

//サインインの型定義
export interface SignInProps {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  rows?: number;
}

//投稿フォームの型定義
export interface PostProps {
  id?: string;
  title: string;
  content: string;
  published: boolean;
  authorId?: string;
  author: {
    name: string;
    image: string;
    email: string;
  } | null;
}

//commentの型定義
export interface CommentEditProps {
  id: string;
  content: string;
  userId: string;
  postId: string;
  commentId: string;
}

// 検索フォームの型定義
export interface PostSearchProps {
  id: string;
  label: string;
  type: string;
  inputRef: React.MutableRefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// いいねのボタンの型定義
export interface FavoriteButtonProps {
  postId: string;
}

// タグの型定義
export interface TagProps {
  id?: string;
  name: string;
}

// タグに紐づく投稿の型定義
export interface TagPostProps {
  tagPosts: [];
}

// followボタンの型定義
export interface FollowButtonProps {
  followerId: string;
}
