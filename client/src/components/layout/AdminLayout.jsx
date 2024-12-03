import {
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Group as GroupIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Message as MessageIcon,
} from "@mui/icons-material";
import {Box, Drawer, Grid2, IconButton, Stack, styled, Typography,} from "@mui/material";
import {useState} from "react";
import {Link as LinkComponent, Navigate, useLocation} from "react-router-dom";
import {grayColor, matBlack} from "../../constants/color";
import {useDispatch, useSelector} from "react-redux";
import {adminLogout} from "../../redux/thunks/admin.js";

const Link = styled(LinkComponent)`
    text-decoration: none;
    border-radius: 2rem;
    padding: 1rem 2rem;
    color: black;

    &:hover {
        color: rgba(0, 0, 0, 0.54);
    }
`;

const adminTabs = [
    {
        name: "Dashboard",
        path: "/admin/dashboard",
        icon: <DashboardIcon/>,
    },
    {
        name: "Users",
        path: "/admin/users",
        icon: <ManageAccountsIcon/>,
    },
    {
        name: "Chats",
        path: "/admin/chats",
        icon: <GroupIcon/>,
    },
    {
        name: "Messages",
        path: "/admin/messages",
        icon: <MessageIcon/>,
    },
];

const SideBar = ({w = "100%"}) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const logoutHandler = () => {
        dispatch(adminLogout())
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant="h5" textTransform={"uppercase"}>
                Alpha Chat
            </Typography>
            <Stack spacing={"1rem"}>
                {adminTabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        sx={
                            tab.path === location.pathname && {
                                bgcolor: matBlack,
                                color: "white",
                                ":hover": {
                                    color: "white",
                                },
                            }
                        }
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))}

                <Link onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToAppIcon/>
                        <Typography>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    );
};

const AdminLayout = ({children}) => {
    const {isAdmin} = useSelector((state) => state.auth);

    const [isMobile, setIsMobile] = useState(false);
    const handleMobile = () => setIsMobile(!isMobile);
    const handleClose = () => setIsMobile(false);

    if (!isAdmin) return <Navigate to={"/admin"}/>;

    return (
        <Grid2 container minHeight={"100vh"}>
            <Box
                sx={{
                    display: {xs: "block", md: "none"},
                    position: "fixed",
                    right: "1rem",
                    top: "1rem",
                }}
            >
                <IconButton onClick={handleMobile}>
                    {isMobile ? <CloseIcon/> : <MenuIcon/>}
                </IconButton>
            </Box>
            <Grid2
                size={{md: 4, lg: 3}}
                sx={{
                    display: {xs: "none", md: "block"},
                }}
            >
                <SideBar/>
            </Grid2>
            <Grid2
                size={{xs: 12, md: 8, lg: 9}}
                sx={{
                    bgcolor: grayColor,
                }}
            >
                {children}
            </Grid2>

            <Drawer open={isMobile} onClose={handleClose}>
                <SideBar w="50vw"/>
            </Drawer>
        </Grid2>
    );
};

export default AdminLayout;
