import { TextField } from "@mui/material";

interface UserInput {
  id: string;
  label: string;
  value: string;
  type?: string;
  onChange?: any;
  placeholder?: string;
  rows?: number;
}

const UserInputForm: React.FC<UserInput> = ({
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
