import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Stack, TextField } from "@mui/material";

interface SearchInput {
  title: string;
}
const PostSearchForm = () => {
  const router = useRouter();
  const {
    register,
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

  return (
    <>
      <Stack component="form" onSubmit={handleSubmit(handleSearch)}>
        <TextField
          {...register("title", { required: true })}
          id="standard-search"
          label="Search field"
          type="search"
          variant="standard"
          placeholder="search"
        />
      </Stack>
    </>
  );
};

export default PostSearchForm;
