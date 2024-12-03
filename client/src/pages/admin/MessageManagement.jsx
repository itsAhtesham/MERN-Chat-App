import React, {useEffect, useState} from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import {Avatar, Box, Skeleton, Stack} from "@mui/material";
import {fileformat, transformImage} from "../../lib/features";
import moment from "moment";
import RenderAttachment from "../../components/shared/RenderAttachment";
import {useAdminMessagesQuery} from "../../redux/api/api.js";
import {useErrors} from "../../hooks/hook.jsx";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachements",
    headerName: "Attachements",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileformat(url);
            return (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {

    const {data, error, isError, isLoading}= useAdminMessagesQuery();

    useErrors([{isError, error}]);

    const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
        setRows(
            data.message.map((i) => ({
                ...i,
                id: i._id,
                sender: {
                    name: i.sender.name,
                    avatar: transformImage(i.sender.avatar, 50),
                },
                createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
            }))
        );
    }
  }, [data]);

  return (
    <AdminLayout>
        {
            isLoading ? <Skeleton height={"100vh"}/> :
                <Table
                heading={"All Messages"}
                columns={columns}
                rows={rows}
                rowHeight={200}
            />
        }
    </AdminLayout>
  );
};

export default MessageManagement;
