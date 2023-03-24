import { GetServerSideProps } from "next";
import prisma from "../../lib/prisma";
import { UserProps } from "../../components/user/User";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import { useRef, useState } from "react";
import { storage } from "../../helpers/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface UserInput {
  id: String;
  name: String;
  email: String;
  password: String;
  image?: String;
}
interface profileImage {
  createObjUrl: string; //画像のpreview表示用
}
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
    setValue,
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
  const inputRef = useRef<HTMLInputElement>();

  const [image, setImage] = useState<any>();
  const [createObjUrl, setCreateObjUrl] = useState<string>();

  if (!createObjUrl) {
    setCreateObjUrl("/images/sample.png");
  }
  // アップロード画像のプレビュー表示
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //画像の情報をfilesに格納
    const { files } = e.target;
    setCreateObjUrl(URL.createObjectURL(files[0]));
    setImage(files[0]);
    // setValueで'imageUrl'のvalueにセットしてあげる
    // setValue("createObjUrl", URL.createObjectURL(files[0]));
  };
  const submitUserUpdate = async (input: UserInput) => {
    // 画像が未選択
    if (!image) {
      const { name, email, password } = input;
      const objUrl = user.image;
      const formData = {
        name: name,
        email: email,
        password: password,
        image: objUrl,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      router.push(`/users/${id}`);
    }
    // 画像が選択されてたら
    else {
      const { name, email, password } = input;
      // Create a reference to 'images/mountains.jpg'
      const mountainImagesRef = ref(storage, "images/" + image.name);
      // 'file' comes from the Blob or File API
      await uploadBytes(mountainImagesRef, image);
      const objUrl = await getDownloadURL(mountainImagesRef);

      const formData = {
        name: name,
        email: email,
        password: password,
        image: objUrl,
      };
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(formData),
      });
      router.push(`/users/${id}`);
    }
  };

  return (
    <Layout>
      <div>
        <h2>User Detail</h2>
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
            <div>
              <Image width={100} height={100} src={`${user.image}`}></Image>
            </div>
          </div>
          {user.image && (
            <Image
              src={createObjUrl}
              // src={createObjUrl}
              width={100}
              height={100}
              className="h-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800 bg-gray"
            ></Image>
          )}
          <input
            ref={inputRef}
            type="file"
            onChange={onFileInputChange}
            accept="image/*"
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
      </div>
    </Layout>
  );
};

export default User;
