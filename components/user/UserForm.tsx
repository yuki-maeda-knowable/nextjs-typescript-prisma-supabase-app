import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";

export type Inputs = {
  name: String;
  email: String;
  password: String;
};

export default function UserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const SubmitUserRegister = async (input: Inputs) => {
    const formData = {
      name: input.name,
      email: input.email,
      password: input.password,
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
      console.log(data);
      //フォーム初期化
      resetField("name");
      resetField("email");
      resetField("password");

      // ユーザ一覧にリダイレクト
      router.push("/users");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div>
      <h3>ユーザー登録</h3>

      <form
        onSubmit={handleSubmit(SubmitUserRegister)}
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

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>

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
