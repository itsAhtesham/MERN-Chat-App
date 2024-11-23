import {AttachFile as AttachFileIcon, Send as SendIcon,} from "@mui/icons-material";
import {IconButton, Skeleton, Stack} from "@mui/material";
import React, {useCallback, useRef, useState} from "react";
import FileMenu from "../components/dialogs/FileMenu";
import AppLayout from "../components/layout/AppLayout";
import MessageComponent from "../components/shared/MessageComponent";
import {InputBox} from "../components/styles/StyledComponents";
import {grayColor, orange} from "../constants/color";
import {getSocket} from "../../socket.jsx";
import {useInfiniteScrollTop} from "6pp";
import {NEW_MESSAGE} from "../constants/events.js";
import {useChatDetailsQuery, useGetMessagesQuery} from "../redux/api/api.js";
import {useErrors, useSocketEvents} from "../hooks/hook.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsFileMenu} from "../redux/reducers/misc.js";

function Chat({chatId, user}) {
    const socket = getSocket();
    const dispatch = useDispatch();
    // const {} = useSelector((state) => state.misc);

    const containerRef = useRef(null);

    const [message, setMessage] = useState("");
    const [page, setPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

    const chatDetails = useChatDetailsQuery({chatId, skip: !chatId})
    const oldMessagesChunk = useGetMessagesQuery({chatId, page})

    const {data: oldMessages, setData: setOldMessages} = useInfiniteScrollTop(
        containerRef,
        oldMessagesChunk.data?.totalPages,
        page,
        setPage,
        oldMessagesChunk.data?.messages
    )

    const errors = [
        { isError: chatDetails.isError, error: chatDetails.error },
        { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
    ]

    useErrors(errors);

    const allMessages = [...oldMessages, ...messages]

    const handleFileOpen = (e) => {
        dispatch(setIsFileMenu(true));
        setFileMenuAnchor(e.currentTarget)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        socket.emit(NEW_MESSAGE, {chatId, members: chatDetails.data.chat.members, message});
        setMessage("")
    }

    const newMessageHandler = useCallback((data) => {
        setMessages(prev => [...prev, data.message])
        console.log("Fn executed")
    }, [])

    const eventHandlers = {[NEW_MESSAGE]: newMessageHandler};

    useSocketEvents(socket, eventHandlers);


    return (
        chatDetails.isLoading ? <Skeleton/> :
            <>
                <Stack
                    ref={containerRef}
                    boxSizing={"border-box"}
                    bgcolor={grayColor}
                    padding={"1rem"}
                    spacing={"1rem"}
                    height={"90%"}
                    sx={{
                        overflowX: "hidden",
                        overflowY: "auto",
                    }}
                >
                    {
                        allMessages.map((i) => (
                            <MessageComponent message={i} user={user} key={i._id}/>
                        ))
                    }
                </Stack>

                <form
                    style={{
                        height: "10%",
                    }}
                    onSubmit={handleSubmit}
                >
                    <Stack
                        direction="row"
                        height={"100%"}
                        padding={"1rem"}
                        alignItems={"center"}
                        position="relative"
                    >
                        <IconButton
                            sx={{
                                position: "absolute",
                                left: "1.5rem",
                                rotate: "30deg",
                            }}
                            onClick={handleFileOpen}
                        >
                            <AttachFileIcon/>
                        </IconButton>

                        <InputBox placeholder="Type a message..." value={message}
                                  onChange={(e) => setMessage(e.target.value)}/>

                        <IconButton
                            type="submit"
                            sx={{
                                rotate: "-30deg",
                                bgcolor: orange,
                                color: "white",
                                marginLeft: "1rem",
                                padding: "0.5rem",
                                "&:hover": {
                                    bgcolor: "error.dark",
                                    ...(message.length === 0 && {
                                        cursor: "not-allowed",
                                    })
                                },
                            }}
                        >
                            <SendIcon/>
                        </IconButton>
                    </Stack>
                </form>

                <FileMenu anchorE1={fileMenuAnchor} chatId={chatId}/>
            </>
    );
}

export default AppLayout()(Chat);
