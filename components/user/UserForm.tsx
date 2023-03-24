import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import { useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import crypto from "crypto";
// ユーザのデフォルト画像
const defaultImg = process.env.NEXT_PUBLIC_DEFAULT_IMG;
interface UserInput {
  name: string;
  email: string;
  password: string;
  image?: string | StaticImageData;
}

type uploadImageUrl = string;

export default function UserForm() {
  const [uploadImageUrl, setUploadImageUrl] = useState<uploadImageUrl>();
  const [uploadImageFile, setUploadImageFile] = useState<File>();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: defaultImg,
    },
  });

  // const inputRef = useRef<HTMLInputElement>();
  // 画像が選択されたら、プレビュー
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    setUploadImageUrl(URL.createObjectURL(files[0]));
    setUploadImageFile(files[0]);
  };

  const submitUserRegister = async (input: UserInput) => {
    //画像があるか判断
    if (uploadImageFile) {
      const randomString = crypto.randomBytes(10).toString("hex");

      // あれば、supabaseに画像をアップロード
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(
          "user/" + randomString + "-" + uploadImageFile.name,
          uploadImageFile
        );
      console.log(data);

      //supabaseから画像のURLをDL
      const url = await supabase.storage.from("photos").getPublicUrl(data.path);
      const { publicUrl } = url.data;

      // DLしたURLをimageに格納
      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: publicUrl,
      };

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // json形式で返す
        const data = await res.json();
        const email = data.email;
        //登録済みのデータを使用するとhash化したpasswordを利用してしまうため、formに入力されたpasswordを使用
        const password = formData.password;
        //sign In()でそのままログイン

        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
          redirect: true,
        });
      } catch (error) {
        console.error("Error registering user:", error);
      }
    } else {
      // なければ、デフォルトの画像を登録
      //supabaseから画像のURLをDL
      const publicUrl = defaultImg;

      // DLしたURLをimageに格納
      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: publicUrl,
      };

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // json形式で返す
        const data = await res.json();
        const email = data.email;
        //登録済みのデータを使用するとhash化したpasswordを利用してしまうため、formに入力されたpasswordを使用
        const password = formData.password;
        //sign In()でそのままログイン

        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
          redirect: false,
        });
      } catch (error) {
        console.error("Error registering user:", error);
      }
    }
  };

  return (
    <div>
      <h3>ユーザー登録</h3>

      <form
        onSubmit={handleSubmit(submitUserRegister)}
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
          src={uploadImageUrl ? uploadImageUrl : defaultImg}
          width={100}
          height={100}
        ></Image>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Upload file
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={onChangeFile}
        />

        <div className="md:flex md:items-center">
          <div className="md:w-2/3">
            <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
              <Link href={`/`}>Home</Link>
            </button>
          </div>
          <div className="md:w-2/3">
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
