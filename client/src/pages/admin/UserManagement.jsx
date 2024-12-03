import {useEffect, useState} from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import {Avatar, Skeleton} from "@mui/material";
import {transformImage} from "../../lib/features";
import {useAdminUsersQuery} from "../../redux/api/api.js";
import {useErrors} from "../../hooks/hook.jsx";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 210,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {

  const {data, error, isError, isLoading}= useAdminUsersQuery();

  useErrors([{isError, error}]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data) {
      setRows(
          data.users.map((i) => ({
            ...i,
            id: i._id,
            avatar: transformImage(i.avatar, 50),
          }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {
        isLoading ? <Skeleton height={"100vh"}/> : <Table heading={"All Users"} columns={columns} rows={rows} />
      }
    </AdminLayout>
  );
};

export default UserManagement;
