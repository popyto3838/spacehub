import React from "react";
import { Box, FormControl, FormLabel } from "@chakra-ui/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const RegisterPage3 = ({ formData, setFormData }) => {
  const handleIntroChange = (value) => {
    setFormData({ ...formData, introduce: value });
  };

  const handleFacilityChange = (value) => {
    setFormData({ ...formData, facility: value });
  };

  const handleNoticeChange = (value) => {
    setFormData({ ...formData, notice: value });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
  ];

  return (
    <Box>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-intro">공간 소개</FormLabel>
        <ReactQuill
          value={(formData && formData.introduce) || ""}
          onChange={handleIntroChange}
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ fontSize: "18px" }}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-facility">시설 안내</FormLabel>
        <ReactQuill
          value={(formData && formData.facility) || ""}
          onChange={handleFacilityChange}
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ fontSize: "18px" }}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel htmlFor="space-notice">유의 사항</FormLabel>
        <ReactQuill
          value={(formData && formData.notice) || ""}
          onChange={handleNoticeChange}
          theme="snow"
          modules={modules}
          formats={formats}
          style={{ fontSize: "18px" }}
        />
      </FormControl>
    </Box>
  );
};

export default RegisterPage3;
