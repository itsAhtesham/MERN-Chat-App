import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorE1 }) => {
  return (
    <Menu anchorEl={anchorE1} open={false}>
      <div
        style={{
          width: "10rem",
        }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius magnam
        tempore blanditiis hic necessitatibus quibusdam rem cum sapiente, nam a
      </div>
    </Menu>
  );
};

export default FileMenu;
