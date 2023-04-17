import { TextField } from "@mui/material";
import { SignInProps } from "../../types/interface";

const UserInputForm: React.FC<SignInProps> = ({
  id,
  label,
  value,
  type,
  onChange,
  placeholder,
  rows,
}) => {
  return (
    <>
      <TextField
        sx={{ width: 300, marginBottom: 2 }}
        label={label}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        id={id}
        multiline={rows ? true : false}
        rows={rows}
        required
      />
    </>
  );
};

export default UserInputForm;
