import { TextField } from "@mui/material";
import { PostSearchProps } from "../../types/interface";

const PostSearchForm: React.FC<PostSearchProps> = ({
  id,
  label,
  type,
  onChange,
  inputRef,
}) => {
  const handleSearch = (input: PostSearchProps) => {};

  return (
    <>
      <TextField
        id={id}
        label={label}
        type={type}
        inputRef={inputRef}
        onChange={onChange}
      />
    </>
  );
};

export default PostSearchForm;
