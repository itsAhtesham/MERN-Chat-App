import AdminLayout from "../../components/layout/AdminLayout";
import {Box, Container, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {
    AdminPanelSettings as AdminPanelSettingsIcon,
    Group as GroupIcon,
    Message as MessageIcon,
    Notifications as NotificationsIcon,
    Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import {CurveButton, SearchField,} from "../../components/styles/StyledComponents";
import {matBlack} from "../../constants/color";
import {DoughnutChart, LineChart} from "../../components/specific/Charts";
import {useDashboardStatsQuery} from "../../redux/api/api.js";
import {useErrors} from "../../hooks/hook.jsx";


const Dashboard = () => {

    const {data, isError, error, isLoading} = useDashboardStatsQuery("");

    useErrors([{isError, error}]);

    const AppBar = (
        <Paper
            elevation={3}
            sx={{
                padding: "2rem",
                margin: "2rem 0",
                borderRadius: "1rem",
            }}
        >
            <Stack direction="row" alignItems={"center"} spacing={"1rem"}>
                <AdminPanelSettingsIcon sx={{fontSize: "3rem"}}/>
                <SearchField placeholder="search..."/>
                <CurveButton>Search</CurveButton>
                <Box flexGrow={"1"}/>

                <Typography
                    display={{
                        xs: "none",
                        lg: "block",
                    }}
                    color={"rgba(0, 0, 0, 0.7)"}
                    textAlign="center"
                >
                    {moment().format("dddd, MMMM Do YYYY")}
                </Typography>
                <NotificationsIcon/>
            </Stack>
        </Paper>
    );

    const Widgets = (
        <Stack
            direction={{
                xs: "column",
                sm: "row",
            }}
            spacing={"2rem"}
            justifyContent={"space-between"}
            alignItems={"center"}
            margin={"2rem 0"}
        >
            <Widget title={"Users"} value={data?.stats?.usersCount || 0} Icon={<PersonIcon/>}/>
            <Widget title={"Chats"} value={data?.stats?.totalChatsCount || 0} Icon={<GroupIcon/>}/>
            <Widget title={"Messages"} value={data?.stats?.messagesCount || 0} Icon={<MessageIcon/>}/>
        </Stack>
    );
    return (
        <AdminLayout>
            {
                isLoading ? <Skeleton height={"100vh"}/> : <Container component={"main"}>
                    {AppBar}
                    <Stack
                        direction={{
                            xs: "column",
                            lg: "row",
                        }}
                        sx={{
                            gap: "2rem",
                        }}
                        flexWrap={"wrap"}
                        justifyContent={"center"}
                        alignItems={{
                            xs: "center",
                            lg: "stretch",
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "2rem 3.5rem",
                                borderRadius: "1rem",
                                width: "100%",
                                maxWidth: "45rem",
                                // height: "25rem",
                            }}
                        >
                            <Typography variant="h4" margin={"2rem 0"}>
                                Last Messages
                            </Typography>

                            <LineChart value={data?.stats?.messages || []}/>
                        </Paper>
                        <Paper
                            elevation={3}
                            sx={{
                                padding: "1rem",
                                borderRadius: "1rem",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: {xs: "100%", sm: "50%"},
                                position: "relative",
                                // width: "100%",
                                maxWidth: "25rem",
                                // height: "25rem",
                            }}
                        >
                            <DoughnutChart
                                labels={["Single Chats", "Group Chats"]}
                                value={[(data?.stats?.totalChatsCount - data?.stats?.groupsCount) || 0, data?.stats?.groupsCount || 0]}
                            />
                            <Stack
                                position={"absolute"}
                                direction={"row"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                spacing={"0.5rem"}
                                width={"100%"}
                                height={"100%"}
                            >
                                <GroupIcon/>
                                <Typography>Vs </Typography>
                                <PersonIcon/>
                            </Stack>
                        </Paper>
                    </Stack>
                    {Widgets}
                </Container>
            }
        </AdminLayout>
    );
};

const Widget = ({title, value, Icon}) => (
    <Paper
        elevation={3}
        sx={{
            padding: "2rem",
            margin: "2rem 0",
            borderRadius: "1rem",
            width: "20rem",
        }}
    >
        <Stack alignItems={"center"} spacing={"1rem"}>
            <Typography
                sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    borderRadius: "50%",
                    border: `5px solid ${matBlack}`,
                    width: "5rem",
                    height: "5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {value}
            </Typography>
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                {Icon}
                <Typography>{title}</Typography>
            </Stack>
        </Stack>
    </Paper>
);

export default Dashboard;
