import {
  AppBar,
  Backdrop, Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy, Suspense, useState } from "react";
import { orange } from "../../constants/color";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {server} from "../../constants/config.js"
import {userNotExists} from "../../redux/reducers/auth.js";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {setIsMobile, setIsNotification, setIsSearch} from "../../redux/reducers/misc.js";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotificationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {isSearch, isNotification} = useSelector((state) => state.misc)
  const {notificationCount} = useSelector((state) => state.chat)

  const [isNewGroup, setIsNewGroup] = useState(false);
  // const [isNotification, setIsNotification] = useState(false);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    setIsNewGroup((p) => !p);
    console.log("openNewGroup");
  };

  const openNotifications = () => dispatch(setIsNotification(true));

  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const {data} = await axios.get(`${server}/user/logout`, { withCredentials: true });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box
        sx={{
          flexGrow: 1,
        }}
        height={"4rem"}
      >
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              Alpha Chat
            </Typography>
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotifications}
                value={notificationCount}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
}

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <>
      <Tooltip title={title}>
        <IconButton color="inherit" size="large" onClick={onClick}>
          {
            value ? <Badge badgeContent={value} color="error">{icon}</Badge> : icon
          }
        </IconButton>
      </Tooltip>
    </>
  );
};

export default Header;
