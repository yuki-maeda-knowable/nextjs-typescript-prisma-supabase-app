import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { storage } from "../../helpers/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface UserInput {
  name: string;
  email: string;
  password: string;
  image: string;
}
interface profileImage {
  createObjUrl: string; //画像のpreview表示用
}

export default function UserForm() {
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
    },
  });

  const inputRef = useRef<HTMLInputElement>();

  const [image, setImage] = useState<File>();
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

  const submitUserRegister = async (input: UserInput) => {
    if (!image) {
      const defaultImage = process.env.NEXT_PUBLIC_DEFAULT_IMG;

      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: defaultImage,
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
      // Create a reference to 'images/mountains.jpg'
      const mountainImagesRef = ref(storage, "images/" + image.name);
      // 'file' comes from the Blob or File API
      await uploadBytes(mountainImagesRef, image);
      const objUrl = await getDownloadURL(mountainImagesRef);

      const formData = {
        name: input.name,
        email: input.email,
        password: input.password,
        image: objUrl,
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
          src={createObjUrl}
          width={100}
          height={100}
          className="h-auto max-w-xl rounded-lg shadow-xl dark:shadow-gray-800 bg-gray"
        ></Image>
        <input
          ref={inputRef}
          type="file"
          onChange={onFileInputChange}
          accept="image/*"
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
