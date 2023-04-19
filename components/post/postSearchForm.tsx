import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Stack, TextField } from "@mui/material";
import { PostSearchForm } from "../../types/interface";

const PostSearchForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSearchForm>({
    defaultValues: {
      title: "",
    },
  });

  const handleSearch = (input: PostSearchForm) => {
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
