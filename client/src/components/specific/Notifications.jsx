import {Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography,} from "@mui/material";
import {memo} from "react";
import {useAcceptFriendRequestMutation, useGetNotificationsQuery} from "../../redux/api/api.js";
import {useAsyncMutation, useErrors} from "../../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsNotification} from "../../redux/reducers/misc.js";

const Notifications = () => {

    const dispatch = useDispatch();
    const {isNotification} = useSelector((state) => state.misc);

    const {isLoading, data, isError, error} = useGetNotificationsQuery();
    const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

    useErrors([{error, isError}]);

    const friendRequestHandler = async ({_id, accept}) => {
        dispatch(setIsNotification(false));
        await acceptRequest("Accepting...", {requestId: _id, accept})
    };

    const closeHandler = () => dispatch(setIsNotification(false));
    return (
        <Dialog open={isNotification} onClose={closeHandler}>
            <Stack p={{xs: "1rem", sm: "2rem"}} maxWidth={"40rem"}>
                <DialogTitle>Notifications</DialogTitle>
                {
                    isLoading ? <Skeleton/> : <>
                        {data?.allRequests.length > 0 ? (
                            data?.allRequests?.map((i) => (
                                <NotificationItem
                                    sender={i.sender}
                                    _id={i._id}
                                    key={i._id}
                                    handler={friendRequestHandler}
                                />
                            ))
                        ) : (
                            <Typography textAlign={"center"}>0 Notifications</Typography>
                        )}
                    </>
                }
            </Stack>
        </Dialog>
    );
};

const NotificationItem = memo(({sender, _id, handler}) => {
    const {name, avatar} = sender;
    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
            >
                <Avatar src={avatar}/>
                <Typography
                    variant="body1"
                    sx={{
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                    }}
                >
                    {`${name} send you a friend request.`}
                </Typography>

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                >
                    <Button onClick={() => handler({_id, accept: true})}>Accept</Button>
                    <Button color="error" onClick={() => handler({_id, accept: false})}>
                        Reject
                    </Button>
                </Stack>
            </Stack>
        </ListItem>
    );
});

export default Notifications;
