import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

interface SearchInput {
  title: string;
}
const PostSearchForm = () => {
  const router = useRouter();
  const {
    register,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchInput>({
    defaultValues: {
      title: "",
    },
  });

  const handleSearch = (input: SearchInput) => {
    const { title } = input;
    router.push({
      pathname: "/",
      query: { keyword: title },
    });
  };

  const handleSearchReset = () => {
    resetField("title");
    router.push("/");
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSearch)}>
        <input
          {...register("title", { required: true })}
          type="text"
          placeholder="search"
        />
        <button
          className="bg-purple-100 bg-transparent hover:bg-purple-500 text-purple-900 font-semibold hover:text-white py-1 px-3 border border-purple-500 hover:border-transparent rounded-full"
          type="submit"
        >
          Search
        </button>
      </form>
      <button
        onClick={handleSearchReset}
        className="bg-purple-100 bg-transparent hover:bg-purple-500 text-purple-900 font-semibold hover:text-white py-1 px-3 border border-purple-500 hover:border-transparent rounded-full"
        type="button"
      >
        リセット
      </button>
    </>
  );
};

export default PostSearchForm;
