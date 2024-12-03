import {Menu, Stack, Typography} from "@mui/material";
import {useSelector} from "react-redux";
import {setIsDeleteMenu} from "../../redux/reducers/misc.js";
import {Delete as DeleteIcon, ExitToApp as ExitToAppIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useAsyncMutation} from "../../hooks/hook.jsx";
import {useDeleteChatMutation, useLeaveGroupMutation} from "../../redux/api/api.js";
import {useEffect} from "react";

const DeleteChatMenu = ({dispatch, deleteOptionAnchor}) => {

    const naviagte = useNavigate();

    const {isDeleteMenu, selectedDeleteChat} = useSelector((state) => state.misc);

    const [deleteChat, _, deleteChatData] = useAsyncMutation(useDeleteChatMutation);
    const [leaveGroup, __, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor = null;
    };

    const isGroup = selectedDeleteChat.groupChat;
    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
    };
    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting Chat", selectedDeleteChat.chatId);
    };

    useEffect(() => {
        if (deleteChatData || leaveGroupData) naviagte('/')
    }, [deleteChatData, naviagte, leaveGroupData]);

    return <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteOptionAnchor} anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
    }} transformOrigin={{
        vertical: "center",
        horizontal: "center"
    }}>
        <Stack direction="row" alignItems="center" spacing={"0.5rem"} sx={{
            width: '10rem',
            padding: '0.5rem',
            cursor: "pointer"
        }}
               onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
        >
            {
                isGroup ? <><ExitToAppIcon/> <Typography>Leave Group</Typography></> : <><DeleteIcon /><Typography>Delete Chat</Typography></>
            }
        </Stack>
    </Menu>
}

export default DeleteChatMenu