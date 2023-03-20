import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";

interface PostInput {
  title: string;
  content: string;
  published: boolean;
}

export default function PostForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostInput>({
    defaultValues: {
      title: "",
      content: "",
      published: false,
    },
  });

  const submitPostRegister = async (input: PostInput) => {
    const { title, content, published } = input;
    const postData = {
      title: title,
      content: content,
      published: published,
    };

    try {
      const res = await fetch(`/api/post`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      router.push("/p/drafts");
    } catch (error) {
      console.error("Error registration Post: ", error);
    }
  };

  return (
    <>
      <h1>New Post</h1>
      <div className="w-full max-w-xs">
        <form
          onSubmit={handleSubmit(submitPostRegister)}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              title
            </label>
            <input
              {...register("title", { required: "入力必須だよ" })}
              className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="title"
            />
            {errors.title && (
              <span style={{ color: "red" }}>{errors.title?.message}</span>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              content
            </label>

            <textarea
              {...register("content", { required: "たくさん書いてね" })}
              id="message"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder="content"
            ></textarea>
            {errors.content && (
              <span style={{ color: "red" }}>{errors.content?.message}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              New Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
