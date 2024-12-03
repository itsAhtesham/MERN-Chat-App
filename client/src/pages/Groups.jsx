import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Done as DoneIcon,
    Edit as EditIcon,
    KeyboardBackspace as KeyboardBackspaceIcon,
    Menu as MenuIcon,
} from "@mui/icons-material";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Drawer,
    Grid2,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {lazy, Suspense, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import {Link} from "../components/styles/StyledComponents";
import {matBlack} from "../constants/color";
import UserItem from "../components/shared/UserItem";
import {
    useChatDetailsQuery,
    useDeleteChatMutation,
    useMyGroupsQuery,
    useRemoveGroupMemberMutation,
    useRenameGroupMutation
} from "../redux/api/api.js";
import {useAsyncMutation, useErrors} from "../hooks/hook.jsx";
import {LayoutLoader} from "../components/layout/Loaders.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsAddMember} from "../redux/reducers/misc.js";

const ConfirmDeleteDialog = lazy(() =>
    import("../components/dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
    import("../components/dialogs/AddMemberDialog")
);

function Groups() {
    const chatId = useSearchParams()[0].get("group");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const navigateBack = () => {
        navigate("/");
    };

    const {isAddMember} = useSelector(state => state.misc);
    const myGroups = useMyGroupsQuery("");
    const groupDetails = useChatDetailsQuery({chatId, populate: true}, {skip: !chatId});
    const [renameGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
    const [members, setMembers] = useState([]);

    const errors = [
        {
            isError: myGroups.isError,
            error: myGroups.error
        },
        {
            isError: groupDetails.isError,
            error: groupDetails.error
        }
    ];

    useErrors(errors);

    useEffect(() => {
        const group = groupDetails.data?.chat;
        if (groupDetails.data) {
            setGroupName(group.name);
            setGroupNameUpdatedValue(group.name);
            setMembers(group.members);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        }
    }, [groupDetails.data]);

    const handleMobileClose = () => setIsMobileMenuOpen(false);

    const handleMobile = () => {
        setIsMobileMenuOpen((p) => !p);
    };


    useEffect(() => {
        if (chatId) {
            setGroupName(groupDetails.data?.chat?.name);
            setGroupNameUpdatedValue(groupDetails.data?.chat?.name);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false);
        };
    }, [chatId, groupDetails.data]);

    const IconBtns = (
        <>
            <Box
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                    },
                    position: "fixed",
                    top: "1rem",
                    right: "1rem",
                }}
            >
                <IconButton onClick={handleMobile}>
                    <MenuIcon/>
                </IconButton>
            </Box>
            <Tooltip title="Back">
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "2rem",
                        left: "2rem",
                        bgcolor: matBlack,
                        color: "white",
                        "&:hover": {
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                        },
                    }}
                    onClick={navigateBack}
                >
                    <KeyboardBackspaceIcon/>
                </IconButton>
            </Tooltip>
        </>
    );

    const updateGroupName = () => {
        renameGroup("Renaming Group", {chatId, name: groupNameUpdatedValue})
        setIsEdit(false);
    };

    const GroupName = (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
            spacing={"1rem"}
            padding={"3rem"}
        >
            {isEdit ? (
                <>
                    <TextField
                        value={groupNameUpdatedValue}
                        onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
                    ></TextField>
                    <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
                        <DoneIcon/>
                    </IconButton>
                </>
            ) : (
                <>
                    <Typography variant="h4">{groupName}</Typography>
                    <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
                        <EditIcon/>
                    </IconButton>
                </>
            )}
        </Stack>
    );

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    };
    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    };

    const groupDeleteHandler = () => {
        deleteGroup("Deleting Group...", chatId);
        closeConfirmDeleteHandler();
        navigate('/groups');
    };

    const removeMemberHandler = (userId) => {
        removeMember("Removing Member", {chatId, userId});
    };

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true))
    };

    const ButtonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row",
            }}
            spacing={"1rem"}
            p={{
                xs: "0",
                sm: "1rem",
                md: "1rem 4rem",
            }}
        >
            <Button
                size="large"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon/>}
                onClick={openConfirmDeleteHandler}
            >
                Delete Group
            </Button>
            <Button
                size="large"
                variant="contained"
                startIcon={<AddIcon/>}
                onClick={openAddMemberHandler}
            >
                Add Members
            </Button>
        </Stack>
    );


    return myGroups.isLoading ? <LayoutLoader/> : (
        <Grid2 container height={"100vh"}>
            <Grid2
                size={{sm: 4}}
                sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                    // overflow: "auto",
                }}
            >
                <GroupsList myGroups={myGroups.data?.groups} chatId={chatId}/>
            </Grid2>

            <Grid2
                size={{xs: 12, sm: 8}}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                    padding: "1rem 3rem",
                }}
            >
                {IconBtns}

                {groupName && (
                    <>
                        {GroupName}
                        <Typography
                            margin={"2rem"}
                            alignSelf={"flex-start"}
                            variant="body1 "
                        >
                            Members
                        </Typography>

                        <Stack
                            maxWidth={"45rem"}
                            width={"100%"}
                            boxSizing={"border-box"}
                            padding={{
                                sm: "1rem",
                                xs: "0",
                                md: "1rem 4rem",
                            }}
                            spacing={"2rem"}
                            // bgcolor={"bisque"}
                            height={"50vh"}
                            overflow={"auto"}
                        >
                            { isLoadingRemoveMember ? <>
                                {/*<Skeleton variant="rounded" height={"20%"} width={"100%"} animation="wave"/>*/}
                                {/*<Skeleton variant="rounded" height={"20%"} width={"100%"} animation="wave"/>*/}
                                {/*<Skeleton variant="rounded" height={"20%"} width={"100%"} animation="wave"/>*/}
                                <CircularProgress/>
                            </>: members.map((i) => (
                                <UserItem
                                    user={i}
                                    key={i._id}
                                    isAdded
                                    styling={{
                                        boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.2)",
                                        padding: "1rem 2rem ",
                                        borderRadius: "1rem",
                                    }}
                                    handler={removeMemberHandler}
                                />
                            ))}
                        </Stack>

                        {ButtonGroup}
                    </>
                )}
            </Grid2>

            {isAddMember && (
                <Suspense fallback={<Backdrop open/>}>
                    <AddMemberDialog chatId={chatId}/>
                </Suspense>
            )}

            {confirmDeleteDialog && (
                <Suspense fallback={<Backdrop open/>}>
                    <ConfirmDeleteDialog
                        open={confirmDeleteDialog}
                        handleClose={closeConfirmDeleteHandler}
                        deleteHandler={groupDeleteHandler}
                    />
                </Suspense>
            )}

            <Drawer
                sx={{
                    display: {
                        xs: "block",
                        sm: "none",
                    },
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileClose}
            >
                <GroupsList w={"50vw"} myGroups={myGroups.data?.groups} chatId={chatId}/>
            </Drawer>
        </Grid2>
    );
}

const GroupsList = ({w = "100%", myGroups = [], chatId}) => {
    return (
        <Stack
            width={w}
            sx={{
                backgroundColor: "bisque",
                height: "100vh",
                overflow: "auto",
            }}
        >
            {myGroups.length > 0 ? (
                myGroups.map((group) => (
                    <GroupListItem group={group} chatId={chatId} key={group._id}/>
                ))
            ) : (
                <Typography textAlign={"center"} padding={"1rem"}>
                    No Groups Found
                </Typography>
            )}
        </Stack>
    );
};

const GroupListItem = ({group, chatId}) => {
    const {name, avatar, _id} = group;

    return (
        <Link
            to={`?group=${_id}`}
            onClick={(e) => {
                if (chatId === _id) e.preventDefault();
            }}
        >
            <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
                <AvatarCard avatar={avatar}/>
                <Typography>{name}</Typography>
            </Stack>
        </Link>
    );
};

export default Groups;
