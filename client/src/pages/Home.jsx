import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Typography } from "@mui/material";

function Home() {
  return (
    <Typography p={"2rem"} variant="h5" textAlign={"center"}>
      Select a Friend to chat
    </Typography>
  );
}

export default AppLayout()(Home);
