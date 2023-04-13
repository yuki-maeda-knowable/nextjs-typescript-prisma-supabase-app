import ReactTags from "react-tag-autocomplete";
import { Box } from "@mui/material";
import { useRef } from "react";

const TagInput = ({ tags, suggestions, onDelete, onAddition }) => {
  const reactTags = useRef();

  return (
    <>
      <Box color={"gray"}>
        <ReactTags
          ref={reactTags}
          tags={tags}
          suggestions={suggestions}
          onDelete={onDelete}
          onAddition={onAddition}
          allowNew
        />
      </Box>
    </>
  );
};

export default TagInput;
