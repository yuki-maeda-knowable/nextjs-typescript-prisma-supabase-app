import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { UserProps } from "../../components/user/User";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";

interface UserInput {
  id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
}
type uploadImageUrl = string;
const defaultImg = process.env.NEXT_PUBLIC_DEFAULT_IMG;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const data = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
  });

  const user = await JSON.parse(JSON.stringify(data));

  return {
    props: user,
  };
};

const User = (user: UserProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      image: user.image,
    },
  });
  const router = useRouter();
  const { id } = router.query;
  //画像URL
  const [uploadImageUrl, setUploadImageUrl] = useState<uploadImageUrl>();

  // supabaseにアップロードする画像ファイル
  const [uploadImageFile, setUploadImageFile] = useState<File>();

  // 画像が選択されたら、プレビュー
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setUploadImageUrl(URL.createObjectURL(files[0]));
    setUploadImageFile(files[0]);
  };

  // 送信ボタンが押されたら
  const submitUserUpdate = async (input: UserInput) => {
    //ユーザの画像がデフォルトかつuploadImageUrlもデフォルトのままだったら、画像は更新しない
    if (user.image === defaultImg && !uploadImageUrl) {
      const { name, email, password } = input;

      const formData = {
        name: name,
        email: email,
        password: password,
        image: defaultImg,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const user = await res.json();
      console.log(user);

      router.push(`/users/${id}`);
    } // uploadImageUrlがデフォルト画像じゃなかったら更新
    else if (uploadImageUrl) {
      const randomString = crypto.randomBytes(10).toString("hex");

      // あれば、supabaseに画像をアップロード
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(
          "user/" + randomString + "-" + uploadImageFile.name,
          uploadImageFile
        );

      //supabaseから画像のURLをDL data.pathに画像のパスが入ってる
      const url = await supabase.storage.from("photos").getPublicUrl(data.path);

      const { publicUrl } = url.data;

      const { name, email, password } = input;

      const formData = {
        name: name,
        email: email,
        password: password,
        image: publicUrl,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      const user = await res.json();
      console.log(user);

      router.push(`/users/${id}`);
    }
  };

  return (
    <Layout>
      <h2>User Detail</h2>
      <div className="md:flex md:items-right mb-6">
        <div className="md:w-1/3 md:items-right">
          <Image src={user.image} width={100} height={100}></Image>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(submitUserUpdate)}
        className="w-full max-w-sm"
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("name", { required: "入力必須だよ" })}
              placeholder="name"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
            />
            {errors.name && (
              <span style={{ color: "red" }}>{errors.name?.message}</span>
            )}
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Email
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("email", { required: "入力必須だよ" })}
              placeholder="***@***.**"
              type="email"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-password"
            />
            {errors.email && (
              <span style={{ color: "red" }}>{errors.email?.message}</span>
            )}
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Password
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("password", {
                required: "入力必須だよ",
                minLength: {
                  value: 8,
                  message: "8文字以上ね",
                },
              })}
              type="password"
              placeholder="********"
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-password"
            />
            {errors.password && (
              <span style={{ color: "red" }}>{errors.password?.message}</span>
            )}
          </div>
        </div>

        <Image
          src={uploadImageUrl ? uploadImageUrl : user.image}
          width={100}
          height={100}
        ></Image>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={onChangeFile}
        />
        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>

          <div className="md:w-2/3">
            <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              <Link href={`/users`}>キャンセル</Link>
            </button>
          </div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default User;
