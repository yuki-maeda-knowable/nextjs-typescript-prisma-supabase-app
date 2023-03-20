import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface UserInput {
  email: String;
  password: String;
}

export default function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitUserSignIn = async (input: UserInput) => {
    const formData = {
      email: input.email,
      password: input.password,
    };
    // signIn()ように書き換える
    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        //callbackUrl指定するとログインした後sessionが削除されるなああ。
        callbackUrl: "/p/drafts",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signin :", error);
    }
  };

  return (
    <div>
      <h3>sign in</h3>

      <form
        onSubmit={handleSubmit(submitUserSignIn)}
        className="w-full max-w-sm"
      >
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Email
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              {...register("email", { required: "入力必須だよ" })}
              placeholder="example@example.com"
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
            <button
              className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </div>
      </form>
      <div className="md:w-2/3">
        <button className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
          <Link href={`/`}>Home</Link>
        </button>
      </div>
    </div>
  );
}
