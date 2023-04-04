import { TextField } from "@mui/material";

interface UserInput {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange?: any;
  placeholder?: string;
}

const UserInputForm: React.FC<UserInput> = ({
  id,
  label,
  value,
  type,
  onChange,
  placeholder,
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
        required
      />
    </>
  );
};

export default UserInputForm;
